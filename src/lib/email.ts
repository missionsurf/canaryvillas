import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const BOOKINGS_BCC = [process.env.ADMIN_EMAIL, "bookings@canaryvillas.com"].filter(Boolean).join(",");

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  depositAmount?: number;
  balanceAmount?: number;
  balanceDueDate?: Date | null;
  paymentMethod?: string;
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
  const depositRow = data.depositAmount
    ? `<tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Deposit paid</td><td style="padding:10px 14px;color:#16a34a;font-weight:700;">€${data.depositAmount.toFixed(2)} ✓</td></tr>`
    : "";
  const balanceRow = data.balanceAmount && data.balanceDueDate
    ? `<tr style="background:#fef9c3;"><td style="padding:10px 14px;color:#854d0e;font-weight:600;">Balance due</td><td style="padding:10px 14px;color:#92400e;font-weight:700;">€${data.balanceAmount.toFixed(2)} by ${format(data.balanceDueDate, "d MMMM yyyy")}</td></tr>`
    : "";
  return `
    <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Property</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">${data.villaName}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-in</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkIn, "EEEE, d MMMM yyyy")}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-out</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkOut, "EEEE, d MMMM yyyy")}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Duration</td><td style="padding:10px 14px;color:#1e293b;">${data.nights} night${data.nights > 1 ? "s" : ""}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Guests</td><td style="padding:10px 14px;color:#1e293b;">${data.guests}</td></tr>
      <tr style="border-top:1px solid #e2e8f0;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Total cost</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">€${data.totalPrice.toFixed(2)}</td></tr>
      ${depositRow}
      ${balanceRow}
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
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;">View your booking portal →</a>
    </div>
    <p style="color:#64748b;font-size:14px;">Questions? Reply to this email or call us on <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a>.</p>
    <p style="color:#64748b;font-size:14px;">See you in Fuerteventura! 🌊</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    bcc: BOOKINGS_BCC,
    subject: `✓ Booking Confirmed — ${data.villaName} | Canary Villas`,
    html,
  });
}

export interface BankTransferEmailData {
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: Date;
  bookingId: string;
}

export async function sendBankTransferInstructions(data: BankTransferEmailData) {
  // EUR account
  const eurBank = process.env.BANK_NAME || "";
  const eurAccountName = process.env.BANK_ACCOUNT_NAME || "Villas de Corralejho 2023";
  const eurIban = process.env.BANK_IBAN || "";
  const eurBic = process.env.BANK_BIC || "";
  // GBP account
  const gbpBank = process.env.BANK_GBP_NAME || "";
  const gbpAccountName = process.env.BANK_GBP_ACCOUNT_NAME || "Villas de Corralejho 2023";
  const gbpSortCode = process.env.BANK_GBP_SORT_CODE || "";
  const gbpAccountNumber = process.env.BANK_GBP_ACCOUNT_NUMBER || "";

  const ref = data.bookingId.slice(-8).toUpperCase();

  function accountTable(rows: string[], refRow: string) {
    return `<table style="width:100%;border-collapse:collapse;font-size:13px;">${rows.filter(Boolean).join("")}${refRow}</table>`;
  }

  const eurRows = [
    eurBank ? `<tr><td style="padding:7px 10px;color:#64748b;">Bank</td><td style="padding:7px 10px;font-weight:600;color:#1e293b;">${eurBank}</td></tr>` : "",
    `<tr style="background:#f8fafc;"><td style="padding:7px 10px;color:#64748b;">Account name</td><td style="padding:7px 10px;font-weight:600;color:#1e293b;">${eurAccountName}</td></tr>`,
    eurIban ? `<tr><td style="padding:7px 10px;color:#64748b;">IBAN</td><td style="padding:7px 10px;font-family:monospace;font-weight:600;color:#1e293b;font-size:12px;">${eurIban}</td></tr>` : "",
    eurBic ? `<tr style="background:#f8fafc;"><td style="padding:7px 10px;color:#64748b;">BIC/SWIFT</td><td style="padding:7px 10px;font-family:monospace;font-weight:600;color:#1e293b;">${eurBic}</td></tr>` : "",
  ];
  const gbpRows = [
    gbpBank ? `<tr><td style="padding:7px 10px;color:#64748b;">Bank</td><td style="padding:7px 10px;font-weight:600;color:#1e293b;">${gbpBank}</td></tr>` : "",
    `<tr style="background:#f8fafc;"><td style="padding:7px 10px;color:#64748b;">Account name</td><td style="padding:7px 10px;font-weight:600;color:#1e293b;">${gbpAccountName}</td></tr>`,
    gbpSortCode ? `<tr><td style="padding:7px 10px;color:#64748b;">Sort code</td><td style="padding:7px 10px;font-family:monospace;font-weight:600;color:#1e293b;">${gbpSortCode}</td></tr>` : "",
    gbpAccountNumber ? `<tr style="background:#f8fafc;"><td style="padding:7px 10px;color:#64748b;">Account no.</td><td style="padding:7px 10px;font-family:monospace;font-weight:600;color:#1e293b;">${gbpAccountNumber}</td></tr>` : "",
  ];
  const refRow = `<tr style="border-top:2px solid #0284c7;"><td style="padding:7px 10px;color:#0284c7;font-weight:700;">Reference</td><td style="padding:7px 10px;font-weight:700;color:#0284c7;font-family:monospace;">${ref}</td></tr>`;

  const html = baseStyle + `
    <div style="display:inline-block;background:#fef9c3;border-radius:50px;padding:8px 16px;margin-bottom:20px;">
      <span style="color:#854d0e;font-weight:700;font-size:14px;">⏳ Dates Reserved — Deposit Required</span>
    </div>
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Almost there, ${data.guestName}!</h2>
    <p style="color:#64748b;margin:0 0 24px;">Your dates are held for 48 hours. Please transfer your 50% deposit to confirm your booking.</p>

    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;">
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Property</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">${data.villaName}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-in</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkIn, "EEEE, d MMMM yyyy")}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-out</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkOut, "EEEE, d MMMM yyyy")}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Total cost</td><td style="padding:10px 14px;color:#1e293b;">€${data.totalPrice.toFixed(2)}</td></tr>
      <tr style="background:#dcfce7;"><td style="padding:10px 14px;color:#166534;font-weight:700;font-size:15px;">50% deposit now</td><td style="padding:10px 14px;color:#166534;font-weight:700;font-size:15px;">€${data.depositAmount.toFixed(2)}</td></tr>
      <tr style="background:#fef9c3;"><td style="padding:10px 14px;color:#854d0e;font-weight:600;">Balance due</td><td style="padding:10px 14px;color:#92400e;">€${data.balanceAmount.toFixed(2)} by ${format(data.balanceDueDate, "d MMMM yyyy")}</td></tr>
    </table>

    <p style="font-weight:700;color:#1e293b;margin:0 0 10px;">Transfer to either account — choose the currency that suits you:</p>
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px 20px;margin:0 0 12px;">
      <p style="margin:0 0 10px;font-weight:700;color:#0369a1;font-size:14px;">🇪🇺 Euro account — €${data.depositAmount.toFixed(2)}</p>
      ${accountTable(eurRows, refRow)}
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin:0 0 12px;">
      <p style="margin:0 0 10px;font-weight:700;color:#1e293b;font-size:14px;">🇬🇧 UK Sterling account</p>
      ${accountTable(gbpRows, refRow)}
    </div>
    <p style="font-size:12px;color:#94a3b8;margin:0 0 20px;">If paying in £, transfer the £ equivalent of €${data.depositAmount.toFixed(2)} at your bank's exchange rate. Always quote your reference <strong>${ref}</strong>.</p>

    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0;color:#991b1b;font-size:13px;"><strong>Important:</strong> Please include your reference number <strong>${data.bookingId.slice(-8).toUpperCase()}</strong> with your transfer. Your dates will be released after 48 hours if we don't receive payment.</p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;">View your booking portal →</a>
    </div>
    <p style="color:#64748b;font-size:14px;">Questions? Reply to this email or call us on <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a>.</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    bcc: BOOKINGS_BCC,
    subject: `Dates Reserved — Please Transfer Deposit | ${data.villaName} | Canary Villas`,
    html,
  });
}

export interface BalanceReminderData {
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  balanceAmount: number;
  balanceDueDate: Date;
  payUrl: string;
  bookingId: string;
}

export async function sendBalanceReminder(data: BalanceReminderData) {
  const html = baseStyle + `
    <div style="display:inline-block;background:#fef9c3;border-radius:50px;padding:8px 16px;margin-bottom:20px;">
      <span style="color:#854d0e;font-weight:700;font-size:14px;">💳 Balance Payment Due</span>
    </div>
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Your balance is due, ${data.guestName}</h2>
    <p style="color:#64748b;margin:0 0 24px;">Your holiday balance for <strong>${data.villaName}</strong> is due by <strong>${format(data.balanceDueDate, "d MMMM yyyy")}</strong>.</p>

    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;">
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Property</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">${data.villaName}</td></tr>
      <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-in</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkIn, "EEEE, d MMMM yyyy")}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-out</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkOut, "EEEE, d MMMM yyyy")}</td></tr>
      <tr style="border-top:2px solid #ef4444;"><td style="padding:10px 14px;color:#dc2626;font-weight:700;font-size:15px;">Balance due</td><td style="padding:10px 14px;color:#dc2626;font-weight:700;font-size:15px;">€${data.balanceAmount.toFixed(2)}</td></tr>
    </table>

    <div style="text-align:center;margin:28px 0;">
      <a href="${data.payUrl}" style="display:inline-block;background:linear-gradient(135deg,#0284c7,#0369a1);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;box-shadow:0 4px 14px rgba(2,132,199,0.3);">Pay Balance Now →</a>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;">View your booking portal →</a>
    </div>
    <p style="color:#64748b;font-size:14px;">Questions? Reply to this email or call us on <a href="tel:+447809870561" style="color:#0284c7;">+44 7809 870561</a>.</p>
    <p style="color:#64748b;font-size:14px;">We can't wait to welcome you to Fuerteventura! 🌊</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    bcc: BOOKINGS_BCC,
    subject: `Balance Due — ${data.villaName} | Canary Villas`,
    html,
  });
}

export async function sendBalancePaidConfirmation(data: BookingEmailData) {
  const html = baseStyle + `
    <div style="display:inline-block;background:#dcfce7;border-radius:50px;padding:8px 16px;margin-bottom:20px;">
      <span style="color:#16a34a;font-weight:700;font-size:14px;">✓ Balance Received — You're All Set!</span>
    </div>
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">All paid — see you in Fuerteventura!</h2>
    <p style="color:#64748b;margin:0 0 24px;">Dear ${data.guestName}, we've received your final balance payment. Your holiday is fully paid and confirmed.</p>
    ${bookingTable(data)}
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;">View your booking portal →</a>
    </div>
    <p style="color:#64748b;font-size:14px;">See you in Fuerteventura! 🏖️</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: data.guestEmail,
    bcc: BOOKINGS_BCC,
    subject: `Balance Received — ${data.villaName} Fully Confirmed | Canary Villas`,
    html,
  });
}

export async function sendBookingNotification(data: BookingEmailData) {
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#dc2626;padding:20px 32px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:12px;">
        <div style="width:14px;height:14px;background:#ffffff;border-radius:50%;display:inline-block;flex-shrink:0;"></div>
        <span style="color:#ffffff;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">New Booking Enquiry</span>
      </div>
      <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="margin:0 0 4px;color:#1e293b;font-size:20px;font-weight:700;">${data.guestName}</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px;">${data.guestEmail}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
          <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Property</td><td style="padding:10px 14px;color:#1e293b;font-weight:700;">${data.villaName}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-in</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkIn, "EEE d MMM yyyy")}</td></tr>
          <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Check-out</td><td style="padding:10px 14px;color:#1e293b;">${format(data.checkOut, "EEE d MMM yyyy")}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-weight:600;">Nights</td><td style="padding:10px 14px;color:#1e293b;">${data.nights}</td></tr>
          <tr style="background:#f8fafc;"><td style="padding:10px 14px;color:#64748b;font-weight:600;">Guests</td><td style="padding:10px 14px;color:#1e293b;">${data.guests}</td></tr>
          <tr style="border-top:2px solid #dc2626;"><td style="padding:10px 14px;color:#dc2626;font-weight:700;font-size:15px;">Total</td><td style="padding:10px 14px;color:#dc2626;font-weight:700;font-size:15px;">€${data.totalPrice.toFixed(2)}</td></tr>
        </table>
        <p style="margin:0 0 16px;font-size:12px;color:#94a3b8;">Ref: ${data.bookingId.slice(-8).toUpperCase()}</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/bookings/${data.bookingId}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;">View booking in admin →</a>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: "bookings@canaryvillas.com",
    bcc: process.env.ADMIN_EMAIL,
    subject: `🔴 New Booking Enquiry — ${data.villaName} | ${format(data.checkIn, "d MMM")}–${format(data.checkOut, "d MMM yyyy")}`,
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
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;">View your booking portal →</a>
    </div>
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
        <img src="https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg" alt="Fuerteventura beach" style="width:100%;height:240px;object-fit:cover;display:block;" />
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

export async function sendGuestOtp(email: string, otp: string) {
  const html = baseStyle + `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Your login code</h2>
    <p style="color:#64748b;margin:0 0 28px;">Use this code to access your Canary Villas booking portal. It expires in 15 minutes.</p>
    <div style="text-align:center;margin:0 0 28px;">
      <div style="display:inline-block;background:#f0f9ff;border:2px dashed #0284c7;border-radius:16px;padding:24px 40px;">
        <p style="margin:0 0 4px;font-size:12px;color:#0369a1;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Login code</p>
        <p style="margin:0;font-size:40px;font-weight:800;color:#0284c7;letter-spacing:8px;font-family:monospace;">${otp}</p>
      </div>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
  ` + baseClose;

  await transporter.sendMail({
    from: `"Canary Villas" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `${otp} — your Canary Villas login code`,
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
