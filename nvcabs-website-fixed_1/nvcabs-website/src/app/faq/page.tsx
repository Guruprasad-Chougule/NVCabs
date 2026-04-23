'use client';
// src/app/faq/page.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'How do I book a cab with NV Cabs?', a: 'You can book a cab through our website by visiting the "Book a Cab" page, filling in your trip details, and confirming via OTP. You can also call us directly at 9530800800 or WhatsApp us for immediate assistance.' },
  { q: 'What vehicle types are available?', a: 'We offer Sedan (4 seater), SUV (6 seater), Toyota Innova Crysta (7 seater), Tempo Traveller (12-14 seater), and Mini Bus (20-22 seater). All vehicles are AC-equipped.' },
  { q: 'Is there a cancellation fee?', a: 'Free cancellation is available if cancelled 24+ hours before pickup for outstation trips, and 2+ hours for airport transfers. See our Cancellation Policy for full details.' },
  { q: 'Do you provide airport pickup and drop?', a: 'Yes! We provide 24/7 airport transfer services to and from Kempegowda International Airport (BLR). Our drivers track your flight and adjust pickup times accordingly.' },
  { q: 'How is the fare calculated?', a: 'Our fare includes a base fare, per-kilometer charges, driver batta (for multi-day trips), estimated toll charges, and 5% GST. You can use our fare estimator on the booking page for an instant quote.' },
  { q: 'Are the drivers verified and experienced?', a: 'Absolutely! All our drivers are professionally trained, police verified, licensed, and have a minimum of 3 years of driving experience. They undergo regular safety and customer service training.' },
  { q: 'Can I modify my booking?', a: 'Yes, bookings can be modified up to 4 hours before the pickup time by calling 9530800800. Modifications may be subject to fare adjustments based on the changes made.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI (PhonePe, GPay, Paytm), credit/debit cards, net banking, and cash. Online payments are processed securely through Razorpay.' },
  { q: 'Do you offer corporate packages?', a: 'Yes, we offer special corporate rates for companies requiring regular cab services. Contact us at support@nvcabs.in or call 9530800800 to discuss a corporate account.' },
  { q: 'What if my driver does not arrive on time?', a: 'Our support team is available 24/7. If your driver is delayed, please call 9530800800 immediately. We ensure prompt resolution and will arrange an alternate cab if necessary.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-blue-200">Everything you need to know about NV Cabs</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#1A237E] pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#1A237E]/5 rounded-xl p-6 text-center">
          <p className="text-[#1A237E] font-semibold mb-2">Still have questions?</p>
          <p className="text-gray-600 text-sm mb-4">Our team is available 24/7 to help you</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:9530800800" className="btn-primary text-sm">Call 9530800800</a>
            <a href="/contact" className="btn-secondary text-sm">Send a Message</a>
          </div>
        </div>
      </div>
    </div>
  );
}
