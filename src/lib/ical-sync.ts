import ical from "node-ical";
import { prisma } from "./prisma";

type CalEvent = {
  type: string;
  start?: Date | string;
  end?: Date | string;
};

export async function syncAirbnbCalendar(villaId: string, icalUrl: string) {
  try {
    const events = await ical.async.fromURL(icalUrl);

    await prisma.blockedDate.deleteMany({
      where: { villaId, reason: "airbnb" },
    });

    const datesToInsert: { villaId: string; date: Date; reason: string }[] = [];

    for (const event of Object.values(events) as CalEvent[]) {
      if (event.type !== "VEVENT") continue;
      if (!event.start || !event.end) continue;

      const start = new Date(event.start);
      const end = new Date(event.end);
      const current = new Date(start);

      while (current < end) {
        datesToInsert.push({ villaId, date: new Date(current), reason: "airbnb" });
        current.setDate(current.getDate() + 1);
      }
    }

    if (datesToInsert.length > 0) {
      for (const d of datesToInsert) {
        await prisma.blockedDate.upsert({
          where: { villaId_date: { villaId: d.villaId, date: d.date } },
          update: {},
          create: d,
        });
      }
    }

    return { success: true, blockedDays: datesToInsert.length };
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
      summary: `BLOCKED — ${b.guestName}`,
      description: `Booking ref: ${b.id}`,
    });
  }

  return cal.toString();
}
