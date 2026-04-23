'use client';
// src/components/home/HeroSection.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Car, ArrowRight, ChevronDown } from 'lucide-react';


const VEHICLE_OPTIONS = [
  { value: 'sedan', label: 'Sedan (4 Seater)' },
  { value: 'suv', label: 'SUV (6 Seater)' },
  { value: 'innova', label: 'Innova Crysta (7 Seater)' },
  { value: 'tempo_traveller', label: 'Tempo Traveller (14 Seater)' },
  { value: 'mini_bus', label: 'Mini Bus (22 Seater)' },
];

export default function HeroSection() {
  const router = useRouter();
  const [form, setForm] = useState({
    pickup: '',
    drop: '',
    date: '',
    vehicle: 'sedan',
  });

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.pickup) params.set('pickup', form.pickup);
    if (form.drop)   params.set('drop', form.drop);
    if (form.date)   params.set('date', form.date);
    if (form.vehicle) params.set('vehicle', form.vehicle);
    router.push(`/book-a-cab?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Available 24/7 across South India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Reliable Cab Services
              <span className="block text-[#FF8F00]">Across South India</span>
            </h1>

            <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
              From airport transfers to outstation trips and tour packages — NV Cabs delivers safe, comfortable, and affordable travel experiences. Book in 60 seconds.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/book-a-cab" className="btn-primary text-base px-8 py-3.5">
                Book a Cab Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/tour-packages" className="btn-outline-white text-base px-8 py-3.5">
                View Packages
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {['✅ 10,000+ Happy Customers', '🚗 5+ Vehicle Types', '🛡️ GST Registered'].map(badge => (
                <div key={badge} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-blue-100 border border-white/10">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Booking widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-[#1A237E] mb-2">Get Instant Fare Estimate</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in your trip details for a quick quote</p>

            <form onSubmit={handleQuickBook} className="space-y-4">
              <div className="relative">
                <label className="label">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A237E]" />
                  <input
                    type="text"
                    placeholder="e.g. Koramangala, Bangalore"
                    value={form.pickup}
                    onChange={e => setForm(p => ({ ...p, pickup: e.target.value }))}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="label">Drop Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6F00]" />
                  <input
                    type="text"
                    placeholder="e.g. Ooty, Tamil Nadu"
                    value={form.drop}
                    onChange={e => setForm(p => ({ ...p, drop: e.target.value }))}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Travel Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Vehicle Type</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={form.vehicle}
                      onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))}
                      className="input-field pl-10 appearance-none cursor-pointer"
                    >
                      {VEHICLE_OPTIONS.map(v => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center text-base py-3.5 mt-2">
                Get Fare Estimate <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              Or call us directly:{' '}
              <a href="tel:9530800800" className="text-[#1A237E] font-semibold hover:text-[#FF6F00]">
                9530800800
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
