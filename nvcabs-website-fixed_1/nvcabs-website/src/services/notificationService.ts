// src/services/notificationService.ts
import { Booking } from '@/types';

// ── SMS via Twilio (mock-ready) ────────────────────────
async function sendSMS(to: string, message: string): Promise<boolean> {
  if (process.env.MOCK_OTP_ENABLED === 'true') {
    console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
    return true;
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !from) {
      console.warn('[SMS] Twilio credentials missing');
      return false;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: `+91${to}`, From: from, Body: message }),
      }
    );

    return response.ok;
  } catch (err) {
    console.error('[SMS Error]', err);
    return false;
  }
}

// ── Email via SendGrid (mock-ready) ───────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (process.env.MOCK_OTP_ENABLED === 'true') {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('[Email] SendGrid API key missing');
      return false;
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'support@nvcabs.in',
          name: process.env.SENDGRID_FROM_NAME || 'NV Cabs',
        },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    return response.status === 202;
  } catch (err) {
    console.error('[Email Error]', err);
    return false;
  }
}

// ── OTP Notification ───────────────────────────────────
export async function sendOTPNotification(phone: string, otp: string): Promise<boolean> {
  const message = `Your NV Cabs OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone. - NV Cabs`;
  return sendSMS(phone, message);
}

// ── Booking Confirmation ───────────────────────────────
export async function sendBookingConfirmation(
  phone: string,
  email: string | null,
  booking: Partial<Booking> & { bookingRef: string; pickupLocation: string; pickupDatetime: string }
): Promise<void> {
  const message = `NV Cabs Booking Confirmed! Ref: ${booking.bookingRef}. Pickup: ${booking.pickupLocation} on ${new Date(booking.pickupDatetime).toLocaleString('en-IN')}. Call 9530800800 for support.`;

  await sendSMS(phone, message);

  if (email) {
    const html = `
      <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: #1A237E; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">NV Cabs</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Booking Confirmed!</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1A237E;">Your booking is confirmed ✅</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Booking Ref</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.bookingRef}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Pickup</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.pickupLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(booking.pickupDatetime).toLocaleString('en-IN')}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 6px; border-left: 4px solid #FF6F00;">
            <p style="margin: 0; color: #E65100;"><strong>Need help?</strong> Call us at <a href="tel:9530800800" style="color: #FF6F00;">9530800800</a></p>
          </div>
        </div>
      </div>
    `;
    await sendEmail(email, `Booking Confirmed - ${booking.bookingRef} | NV Cabs`, html);
  }
}

// ── Driver Assigned Notification ───────────────────────
export async function sendDriverAssignedNotification(
  phone: string,
  driverName: string,
  driverPhone: string,
  vehicleNumber: string,
  bookingRef: string
): Promise<void> {
  const message = `NV Cabs: Driver assigned for ${bookingRef}. Driver: ${driverName} | Phone: ${driverPhone} | Vehicle: ${vehicleNumber}. Safe travels!`;
  await sendSMS(phone, message);
}

// ── Cancellation Notification ─────────────────────────
export async function sendCancellationNotification(
  phone: string,
  email: string | null,
  bookingRef: string
): Promise<void> {
  const message = `NV Cabs: Your booking ${bookingRef} has been cancelled. Refund (if applicable) will be processed in 5-7 business days. Call 9530800800 for help.`;
  await sendSMS(phone, message);

  if (email) {
    const html = `<p>Your booking <strong>${bookingRef}</strong> has been cancelled. We're sorry to see you go!</p>`;
    await sendEmail(email, `Booking Cancelled - ${bookingRef} | NV Cabs`, html);
  }
}
