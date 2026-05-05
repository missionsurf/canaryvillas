import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const ref = booking.id.slice(-8).toUpperCase();
  const accommodation = booking.pricePerNight * booking.nights;
  const cleaning = booking.cleaningFee;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invoice ${ref} — Canary Villas</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 48px; max-width: 760px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #0284c7; }
  .brand h1 { font-size: 28px; font-weight: 800; color: #0284c7; }
  .brand p { color: #64748b; font-size: 13px; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta h2 { font-size: 20px; color: #0284c7; text-transform: uppercase; letter-spacing: 2px; }
  .invoice-meta p { font-size: 13px; color: #64748b; margin-top: 4px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
  .party p { font-size: 14px; color: #1e293b; line-height: 1.6; }
  .party strong { display: block; font-size: 16px; margin-bottom: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #f1f5f9; }
  th { padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
  td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
  tr:last-child td { border-bottom: none; }
  .total-row td { background: #0284c7; color: #fff; font-weight: 700; font-size: 16px; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
  .status-confirmed { background: #dcfce7; color: #16a34a; }
  .status-pending { background: #fef9c3; color: #854d0e; }
  .status-refunded { background: #f1f5f9; color: #475569; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; line-height: 1.8; text-align: center; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="header">
  <div class="brand">
    <h1>Canary Villas</h1>
    <p>Corralejo, Fuerteventura, Spain</p>
    <p>info@canaryvillas.com · +44 7809 870561</p>
  </div>
  <div class="invoice-meta">
    <h2>Invoice</h2>
    <p><strong>#${ref}</strong></p>
    <p>Issued: ${format(new Date(), "d MMMM yyyy")}</p>
    <p style="margin-top:8px;"><span class="status status-${booking.status}">${booking.status}</span></p>
  </div>
</div>

<div class="parties">
  <div class="party">
    <h3>From</h3>
    <p>
      <strong>Canary Villas</strong>
      Corralejo, Fuerteventura<br/>
      Canary Islands, Spain<br/>
      info@canaryvillas.com
    </p>
  </div>
  <div class="party">
    <h3>To</h3>
    <p>
      <strong>${booking.guestName}</strong>
      ${booking.guestEmail}<br/>
      ${booking.guestPhone ? booking.guestPhone : ""}
    </p>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th style="text-align:right;">Qty</th>
      <th style="text-align:right;">Unit Price</th>
      <th style="text-align:right;">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>${booking.villa.name}</strong><br/>
        <span style="color:#64748b;font-size:13px;">${format(booking.checkIn, "d MMM yyyy")} → ${format(booking.checkOut, "d MMM yyyy")}</span>
      </td>
      <td style="text-align:right;">${booking.nights} nights</td>
      <td style="text-align:right;">€${booking.pricePerNight.toFixed(2)}</td>
      <td style="text-align:right;">€${accommodation.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Cleaning fee</td>
      <td style="text-align:right;">1</td>
      <td style="text-align:right;">€${cleaning.toFixed(2)}</td>
      <td style="text-align:right;">€${cleaning.toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td colspan="3"><strong>Total</strong></td>
      <td style="text-align:right;"><strong>€${booking.totalPrice.toFixed(2)}</strong></td>
    </tr>
  </tbody>
</table>

<p style="font-size:13px;color:#64748b;">Payment method: Card (via Stripe)${booking.stripePaymentId ? ` · Reference: ${booking.stripePaymentId}` : ""}</p>
<p style="font-size:13px;color:#64748b;margin-top:4px;">Guests: ${booking.guests} · Booking source: ${booking.source}</p>

<div class="footer">
  <p>Thank you for choosing Canary Villas. We hope you have a wonderful stay!</p>
  <p style="margin-top:4px;">canaryvillas.com · info@canaryvillas.com · +44 7809 870561</p>
  <p style="margin-top:8px;"><button onclick="window.print()" style="background:#0284c7;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:13px;">Print / Save as PDF</button></p>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
