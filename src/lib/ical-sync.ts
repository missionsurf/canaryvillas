import ical from "node-ical";
import { prisma } from "./prisma";
import { differenceInDays } from "date-fns";

type CalEvent = {
  type: string;
  uid?: string;
  summary?: string;
  description?: string;
  start?: Date | string;
  end?: Date | string;
};

export async function syncAirbnbCalendar(villaId: string, icalUrl: string) {
  try {
    const events = await ical.async.fromURL(icalUrl);

    const villa = await prisma.villa.findUnique({
      where: { id: villaId },
      select: { pricePerNight: true, cleaningFee: true },
    });
    if (!villa) return { success: false, error: "Villa not found" };

    // Collect all Airbnb UIDs seen in this sync
    const seenUids: string[] = [];
    const datesToBlock: { villaId: string; date: Date; reason: string }[] = [];

    for (const event of Object.values(events) as CalEvent[]) {
      if (event.type !== "VEVENT") continue;
      if (!event.start || !event.end) continue;

      const start = new Date(event.start);
      const end = new Date(event.end);
      const uid = event.uid || "";
      const summary = event.summary || "Airbnb Reservation";

      // Skip "Airbnb (Not available)" blocks — these are just unavailability windows
      // Only skip if summary is exactly "Not available" (Airbnb owner blocks)
      // "Reserved" = actual guest booking

      const nights = differenceInDays(end, start);
      if (nights <= 0) continue;

      // Upsert booking record using UID stored in notes
      if (uid) {
        seenUids.push(uid);
        const uidTag = `airbnb_uid:${uid}`;

        const existing = await prisma.booking.findFirst({
          where: { villaId, source: "airbnb", notes: { contains: uidTag } },
        });

        const totalPrice = villa.pricePerNight * nights + villa.cleaningFee;
        const bookingData = {
          guestName: summary === "Reserved" ? "Airbnb Guest" : summary,
          checkIn: start,
          checkOut: end,
          nights,
          totalPrice,
          status: "confirmed",
        };

        if (existing) {
          await prisma.booking.update({ where: { id: existing.id }, data: bookingData });
        } else {
          await prisma.booking.create({
            data: {
              villaId,
              guestName: bookingData.guestName,
              guestEmail: "airbnb@placeholder.com",
              checkIn: start,
              checkOut: end,
              guests: 1,
              nights,
              pricePerNight: villa.pricePerNight,
              cleaningFee: villa.cleaningFee,
              totalPrice,
              status: "confirmed",
              source: "airbnb",
              paymentMethod: "airbnb",
              notes: uidTag,
            },
          });
        }
      }

      // Also block individual dates
      const current = new Date(start);
      while (current < end) {
        datesToBlock.push({ villaId, date: new Date(current), reason: "airbnb" });
        current.setDate(current.getDate() + 1);
      }
    }

    // Remove any Airbnb bookings not in this sync (cancelled on Airbnb)
    if (seenUids.length > 0) {
      const existingAirbnbBookings = await prisma.booking.findMany({
        where: { villaId, source: "airbnb" },
        select: { id: true, notes: true },
      });
      for (const b of existingAirbnbBookings) {
        const uid = b.notes?.match(/airbnb_uid:(.+)/)?.[1];
        if (uid && !seenUids.includes(uid)) {
          await prisma.booking.update({ where: { id: b.id }, data: { status: "cancelled" } });
        }
      }
    }

    // Refresh blocked dates
    await prisma.blockedDate.deleteMany({ where: { villaId, reason: "airbnb" } });
    for (const d of datesToBlock) {
      await prisma.blockedDate.upsert({
        where: { villaId_date: { villaId: d.villaId, date: d.date } },
        update: {},
        create: d,
      });
    }

    return { success: true, blockedDays: datesToBlock.length };
  } catch (err) {
    console.error("iCal sync error:", err);
    return { success: false, error: String(err) };
  }
}

export async function generateIcal(villaId: string, villaName: string) {
  const IcalGenerator = (await import("ical-generator")).default;

  const bookings = await prisma.booking.findMany({
    where: { villaId, status: { in: ["confirmed", "pending"] } },
  });

  const cal = IcalGenerator({ name: `Canary Villas — ${villaName}` });

  for (const b of bookings) {
    cal.createEvent({
      start: b.checkIn,
      end: b.checkOut,
      summary: b.source === "airbnb" ? "BLOCKED — Airbnb" : `BLOCKED — ${b.guestName}`,
      description: b.source === "airbnb" ? "Airbnb reservation" : `Booking ref: ${b.id}`,
    });
  }

  return cal.toString();
}
