// src/app/cancellation-policy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | NV Cabs',
  description: 'NV Cabs cancellation and refund policy. Free cancellation 24+ hours before pickup. Clear refund timelines.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Cancellation & Refund Policy</h1>
        <p className="text-blue-200">Last updated: April 2026</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate max-w-none">
        <div className="space-y-8 text-gray-700">
          {[
            { title: '1. Free Cancellation', body: 'Customers may cancel their booking free of charge if the cancellation is made at least 24 hours before the scheduled pickup time for all outstation services. For airport transfers, free cancellation is allowed if done at least 2 hours before the scheduled pickup.' },
            { title: '2. Cancellations Within 24 Hours', body: 'For single-day trips and airport transfers cancelled within 24 hours of the scheduled pickup, no refund will be provided. For multi-day trips cancelled within 24 hours of departure, the charges for the first day will be deducted and the remaining amount will be refunded.' },
            { title: '3. Driver Already En Route', body: 'If the booking is cancelled after the driver has been dispatched and is en route to the pickup location, a cancellation fee equivalent to 50% of the base fare will be charged.' },
            { title: '4. No-Show Policy', body: 'In case of customer no-show (customer is not present at the pickup location within 30 minutes of the scheduled time), the full booking amount will be forfeited.' },
            { title: '5. Refund Processing', body: 'Eligible refunds will be processed within 5-7 business days to the original payment method. UPI and bank transfer refunds may take up to 3 business days. Card refunds may take 5-7 business days depending on your bank.' },
            { title: '6. Force Majeure', body: 'In case of cancellations due to natural disasters, extreme weather, government restrictions, or other force majeure events, a full refund will be provided or the booking will be rescheduled at no additional cost.' },
            { title: '7. How to Cancel', body: 'To cancel a booking, please call us at 9530800800, WhatsApp us, or email support@nvcabs.in with your booking reference number. Cancellations are only valid when confirmed by NV Cabs via SMS or email.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-bold text-[#1A237E] mb-3">{title}</h2>
              <p className="leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
