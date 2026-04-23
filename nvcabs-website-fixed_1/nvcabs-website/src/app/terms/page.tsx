// src/app/terms/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions | NV Cabs' };
export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', body: 'By using NV Cabs services — including our website, mobile app, or by booking via phone/WhatsApp — you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
    { title: '2. Booking & Confirmation', body: 'A booking is confirmed only upon receipt of a confirmation SMS or email with a booking reference number. NV Cabs reserves the right to cancel any booking due to driver unavailability, vehicle breakdown, or force majeure events, with a full refund.' },
    { title: '3. Passenger Responsibilities', body: 'Passengers must be ready at the pickup location at the scheduled time. Smoking, consumption of alcohol, and any illegal activity inside the vehicle is strictly prohibited. Passengers are responsible for any damage caused to the vehicle during their trip.' },
    { title: '4. Luggage Policy', body: 'Standard luggage within the vehicle\'s boot capacity is included. For excessive luggage or special items (bicycles, large equipment), please inform us at the time of booking. NV Cabs is not liable for loss or damage to passenger belongings.' },
    { title: '5. Pricing & Payment', body: 'All prices are inclusive of GST (5%). Toll charges are additional and estimated at the time of booking; actual charges may vary. Payment must be completed as agreed — advance payment for online bookings, or cash/UPI on trip completion for phone bookings.' },
    { title: '6. Driver Behavior', body: 'Our drivers are trained professionals. If you face any issue with driver behavior, please report it immediately at 9530800800. NV Cabs takes all complaints seriously and investigates thoroughly.' },
    { title: '7. Liability Limitation', body: 'NV Cabs is not liable for delays caused by traffic, weather, road closures, or other circumstances beyond our control. Our maximum liability for any claim shall not exceed the amount paid for the specific booking.' },
    { title: '8. Governing Law', body: 'These Terms are governed by the laws of Karnataka, India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.' },
    { title: '9. Changes to Terms', body: 'NV Cabs reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of the revised Terms.' },
  ];
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-blue-200">Last updated: April 2026</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-5">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-bold text-[#1A237E] mb-3">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
