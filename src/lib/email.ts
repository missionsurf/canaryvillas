import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  bookingId: string;
}

const baseStyle = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#0284c7,#0369a1);padding:32px 40px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Canary Villas</h1>
      <p style="margin:4px 0 0;color:#bae6fd;font-size:14px;">Corralejo, Fuerteventura, Spain</p>
    </div>
    <div style="padding:32px 40px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
`;
const baseClose = `
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">Canary Villas · Corralejo, Fuerteventura · <a href="mailto:info@canaryvillas.com" style="color:#0284c7;">info@canaryvillas.com</a> · <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a></p>
  </div>
`;

function bookingTable(data: BookingEmailData) {
  return `
    <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Property</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">${data.villaName}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-in</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkIn, "EEEE, d MMMM yyyy")}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-out</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkOut, "EEEE, d MMMM yyyy")}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Duration</td><td style="padding:10px 14px;color:#1e293b;">${data.nights} night${data.nights > 1 ? "s" : ""}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Guests</td><td style="padding:10px 14px;color:#1e293b;">${data.guests}</td></tr>
      <tr style="border-top:2px solid #0284c7;"><td style="padding:10px 14px;color:#0284c7;font-weight:700;font-size:15px;">Total Paid</td><td style="padding:10px 14px;color:#0284c7;font-weight:700;font-size:15px;">€${data.totalPrice.toFixed(2)}</td></tr>
    </table>
    <p style="font-size:12px;color:#94a3b8;margin-top:0;">Booking reference: <strong style="color:#475569;">${data.bookingId.slice(-8).toUpperCase()}</strong></p>
  `;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const html = baseStyle + `
    <div style="display:inline-block;background:#dcfce7;border-radius:50px;padding:8px 16px;margin-bottom:20px;">
      <span style="color:#16a34a;font-weight:700;font-size:14px;">✓ Booking Confirmed</span>
    </div>
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">You're going to Fuerteventura!</h2>
    <p style="color:#64748b;margin:0 0 24px;">Dear ${data.guestName}, your booking is confirmed. We can't wait to welcome you.</p>
    ${bookingTable(data)}
    <div style="background:#f0f9ff;border-left:4px solid #0284c7;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:#0369a1;">What happens next?</p>
      <p style="margin:0;color:#0369a1;font-size:14px;">Our team will send you full arrival instructions — including property access, WiFi details and local tips — closer to your check-in date.</p>
    </div>
    <p style="color:#64748b;font-size:14px;">Questions? Reply to this email or call us on <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a>.</p>
    <p style="color:#64748b;font-size:14px;">See you in Fuerteventura! 🌊</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    bcc: process.env.ADMIN_EMAIL,
    subject: `✓ Booking Confirmed — ${data.villaName} | Canary Villas`,
    html,
  });
}

export async function sendBookingNotification(data: BookingEmailData) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#0284c7;">New Booking Received</h2>
      <p><strong>${data.guestName}</strong> (${data.guestEmail}) has booked <strong>${data.villaName}</strong>.</p>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;border:1px solid #e2e8f0;">Dates</td><td style="padding:8px;border:1px solid #e2e8f0;">${format(data.checkIn, "d MMM yyyy")} → ${format(data.checkOut, "d MMM yyyy")} (${data.nights} nights)</td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0;">Guests</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.guests}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0;">Total</td><td style="padding:8px;border:1px solid #e2e8f0;">€${data.totalPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0;">Booking ID</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.bookingId}</td></tr>
      </table>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/bookings/${data.bookingId}">View in admin →</a></p>
    </div>
  `;
  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${data.villaName} — ${format(data.checkIn, "d MMM")} to ${format(data.checkOut, "d MMM yyyy")}`,
    html,
  });
}

export interface ArrivalData {
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  address: string;
  accessCode?: string;
  wifiName?: string;
  wifiPassword?: string;
  parking?: string;
  checkInTime?: string;
  checkOutTime?: string;
  extraNotes?: string;
  bookingId: string;
}

export async function sendArrivalInstructions(data: ArrivalData) {
  const rows = [
    ["Property", data.villaName],
    ["Address", data.address],
    ["Check-in", `${format(data.checkIn, "EEEE, d MMMM yyyy")}${data.checkInTime ? ` from ${data.checkInTime}` : ""}`],
    ["Check-out", `${format(data.checkOut, "EEEE, d MMMM yyyy")}${data.checkOutTime ? ` by ${data.checkOutTime}` : ""}`],
    ...(data.accessCode ? [["Access Code / Key", `<strong style="font-size:18px;letter-spacing:2px;">${data.accessCode}</strong>`]] : []),
    ...(data.wifiName ? [["WiFi Network", data.wifiName]] : []),
    ...(data.wifiPassword ? [["WiFi Password", `<strong>${data.wifiPassword}</strong>`]] : []),
    ...(data.parking ? [["Parking", data.parking]] : []),
  ] as [string, string][];

  const tableRows = rows.map((([k, v], i) =>
    `<tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}"><td style="padding:10px 14px;color:#64748b;font-weight:600;vertical-align:top;">${k}</td><td style="padding:10px 14px;color:#1e293b;">${v}</td></tr>`
  )).join("");

  const html = baseStyle + `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Your Arrival Instructions</h2>
    <p style="color:#64748b;margin:0 0 24px;">Dear ${data.guestName}, we're looking forward to welcoming you! Here's everything you need for a smooth arrival.</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;">${tableRows}</table>
    ${data.extraNotes ? `
    <div style="background:#fefce8;border-left:4px solid #eab308;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-weight:700;color:#854d0e;">Additional Information</p>
      <p style="margin:0;color:#713f12;font-size:14px;white-space:pre-line;">${data.extraNotes}</p>
    </div>` : ""}
    <p style="color:#64748b;font-size:14px;">Questions on arrival? Call or WhatsApp us: <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a></p>
    <p style="color:#64748b;font-size:14px;">Enjoy your stay! 🏖️</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    subject: `Your Arrival Instructions — ${data.villaName} | Canary Villas`,
    html,
  });
}

export interface SpecialOfferData {
  guestName: string;
  guestEmail: string;
  subject: string;
  headline: string;
  bodyHtml: string;
  discountCode?: string;
  discountText?: string;
  validUntil?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export async function sendSpecialOffer(data: SpecialOfferData) {
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="position:relative;overflow:hidden;border-radius:12px 12px 0 0;">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80" alt="Fuerteventura beach" style="width:100%;height:240px;object-fit:cover;display:block;" />
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(2,132,199,0.3),rgba(3,105,161,0.85));display:flex;flex-direction:column;justify-content:flex-end;padding:28px 36px;">
          <p style="margin:0 0 4px;color:#bae6fd;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Canary Villas · Exclusive Offer</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.2;">${data.headline}</h1>
        </div>
      </div>
      <div style="padding:32px 40px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
        <p style="color:#64748b;margin:0 0 20px;font-size:15px;">Dear ${data.guestName},</p>
        <div style="color:#1e293b;font-size:15px;line-height:1.75;margin-bottom:28px;">${data.bodyHtml}</div>
        ${data.discountCode ? `
        <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:2px dashed #0284c7;border-radius:12px;padding:20px 24px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 8px;color:#0369a1;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${data.discountText || "Your exclusive discount code"}</p>
          <p style="margin:0 0 8px;font-family:monospace;font-size:28px;font-weight:800;color:#0284c7;letter-spacing:4px;">${data.discountCode}</p>
          ${data.validUntil ? `<p style="margin:0;color:#64748b;font-size:13px;">Valid until ${data.validUntil}</p>` : ""}
        </div>` : ""}
        ${data.ctaUrl ? `
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${data.ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#0284c7,#0369a1);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px;box-shadow:0 4px 14px rgba(2,132,199,0.3);">${data.ctaText || "Book Now"} →</a>
        </div>` : ""}
        <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:20px;">
          <p style="color:#64748b;font-size:14px;margin:0;">The Canary Villas Team</p>
          <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;"><a href="mailto:info@canaryvillas.com" style="color:#0284c7;">info@canaryvillas.com</a> · <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a></p>
        </div>
      </div>
      <p style="text-align:center;color:#cbd5e1;font-size:11px;margin-top:16px;">You received this because you've stayed with Canary Villas. To unsubscribe reply with "unsubscribe".</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    subject: data.subject,
    html,
  });
}

export async function sendCustomEmail(to: string, guestName: string, subject: string, bodyHtml: string) {
  const html = baseStyle + `
    <p style="color:#64748b;margin:0 0 16px;">Dear ${guestName},</p>
    <div style="color:#1e293b;font-size:15px;line-height:1.7;">${bodyHtml}</div>
    <div style="border-top:1px solid #e2e8f0;margin-top:32px;padding-top:20px;">
      <p style="color:#64748b;font-size:14px;margin:0;">The Canary Villas Team</p>
      <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;"><a href="mailto:info@canaryvillas.com" style="color:#0284c7;">info@canaryvillas.com</a> · <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a></p>
    </div>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
