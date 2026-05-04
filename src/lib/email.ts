import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

interface BookingEmailData {
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

export async function sendBookingConfirmation(data: BookingEmailData) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a5276;">Booking Confirmed — Canary Villas</h1>
      <p>Dear ${data.guestName},</p>
      <p>Your booking has been confirmed. We look forward to welcoming you!</p>
      <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background:#f0f3f4;"><td style="padding:10px; font-weight:bold;">Property</td><td style="padding:10px;">${data.villaName}</td></tr>
        <tr><td style="padding:10px; font-weight:bold;">Check-in</td><td style="padding:10px;">${format(data.checkIn, "EEEE d MMMM yyyy")}</td></tr>
        <tr style="background:#f0f3f4;"><td style="padding:10px; font-weight:bold;">Check-out</td><td style="padding:10px;">${format(data.checkOut, "EEEE d MMMM yyyy")}</td></tr>
        <tr><td style="padding:10px; font-weight:bold;">Nights</td><td style="padding:10px;">${data.nights}</td></tr>
        <tr style="background:#f0f3f4;"><td style="padding:10px; font-weight:bold;">Guests</td><td style="padding:10px;">${data.guests}</td></tr>
        <tr><td style="padding:10px; font-weight:bold;">Total Paid</td><td style="padding:10px;">€${data.totalPrice.toFixed(2)}</td></tr>
        <tr style="background:#f0f3f4;"><td style="padding:10px; font-weight:bold;">Booking Ref</td><td style="padding:10px;">${data.bookingId.toUpperCase()}</td></tr>
      </table>
      <p>If you have any questions, please contact us at <a href="mailto:info@canaryvillas.com">info@canaryvillas.com</a> or call <a href="tel:+447809870561">+44 7809 870561</a>.</p>
      <p>See you in Fuerteventura! 🌊</p>
      <p>The Canary Villas Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.guestEmail,
    bcc: process.env.ADMIN_EMAIL,
    subject: `Booking Confirmed — ${data.villaName} | Canary Villas`,
    html,
  });
}

export async function sendBookingNotification(data: BookingEmailData) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${data.villaName} — ${format(data.checkIn, "d MMM")} to ${format(data.checkOut, "d MMM yyyy")}`,
    html: `<p>New booking from <strong>${data.guestName}</strong> (${data.guestEmail}).</p>
           <p>Property: ${data.villaName}</p>
           <p>Dates: ${format(data.checkIn, "d MMM yyyy")} — ${format(data.checkOut, "d MMM yyyy")} (${data.nights} nights)</p>
           <p>Total: €${data.totalPrice.toFixed(2)}</p>
           <p>Booking ID: ${data.bookingId}</p>`,
  });
}
