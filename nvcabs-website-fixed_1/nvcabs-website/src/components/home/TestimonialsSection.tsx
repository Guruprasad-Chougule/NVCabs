'use client';
// src/components/home/TestimonialsSection.tsx
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Review } from '@/types';

const FALLBACK_REVIEWS = [
  { id: '1', rating: 5, comment: 'Excellent service! Driver was punctual and very professional. The car was clean and comfortable. Will definitely book again for my next trip to Ooty.', user: { name: 'Priya Sharma' }, createdAt: new Date().toISOString(), userId: '1', isApproved: true },
  { id: '2', rating: 5, comment: 'Best cab service in Bangalore. Used NV Cabs for airport transfer and it was seamless. Driver tracked my flight and was waiting at arrivals. Highly recommend!', user: { name: 'Arun Mehta' }, createdAt: new Date().toISOString(), userId: '2', isApproved: true },
  { id: '3', rating: 5, comment: 'Used NV Cabs for Coorg trip with family. Amazing experience! Driver was very helpful and knew all the scenic spots. Pricing was transparent and fair.', user: { name: 'Vikram Rajan' }, createdAt: new Date().toISOString(), userId: '3', isApproved: true },
  { id: '4', rating: 4, comment: 'Good service for Mysore day trip. Car was comfortable and driver was knowledgeable about the city. Will use again for future trips.', user: { name: 'Meena Krishnan' }, createdAt: new Date().toISOString(), userId: '4', isApproved: true },
  { id: '5', rating: 5, comment: 'Perfect Tirupati pilgrimage trip. Driver helped with darshan queue management. Truly a stress-free and blessed experience. Thank you NV Cabs!', user: { name: 'Anand Patel' }, createdAt: new Date().toISOString(), userId: '5', isApproved: true },
];

export default function TestimonialsSection({ reviews }: { reviews: (Review & { user: { name: string } })[] }) {
  const [current, setCurrent] = useState(0);
  const allReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;
  const prev = () => setCurrent(c => (c === 0 ? allReviews.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === allReviews.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-[#1A237E] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48" />

      <div className="container-custom relative">
        <div className="text-center mb-12">
          <p className="text-[#FF8F00] font-semibold text-sm uppercase tracking-wide mb-2">Customer Love</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#FF8F00] text-[#FF8F00]" />)}
            <span className="text-blue-200 ml-2 text-sm">4.8/5 average rating</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <Quote className="w-10 h-10 text-[#FF8F00] opacity-60 mb-4" />
            <p className="text-white text-lg leading-relaxed mb-6 min-h-[80px]">
              &ldquo;{allReviews[current].comment}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{allReviews[current].user.name}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: allReviews[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF8F00] text-[#FF8F00]" />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="w-10 h-10 rounded-full bg-[#FF6F00] hover:bg-[#FF8F00] flex items-center justify-center text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {allReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#FF8F00] w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
