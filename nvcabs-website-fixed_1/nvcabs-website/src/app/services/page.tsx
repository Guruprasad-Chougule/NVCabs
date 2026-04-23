// src/app/services/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
export const metadata: Metadata = { title: 'Cab Services in Bangalore | NV Cabs', description: 'Complete cab services in Bangalore — outstation, airport, city rides, railway transfers, car rental, and tour packages.' };

const SERVICES_DETAIL = [
  {
    id: 'outstation',
    title: 'Outstation Cabs',
    emoji: '🗺️',
    description: 'Long-distance taxi services to destinations across South India. Our outstation cabs offer one-way and round-trip options with transparent pricing and experienced drivers who know the routes.',
    features: ['One-Way & Round Trip', 'All Major Destinations', 'AC Vehicles', 'GST Invoice', '24/7 Support', 'No Hidden Charges'],
    vehicles: ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'],
    pricing: 'Starting ₹12/km + Base Fare',
  },
  {
    id: 'airport',
    title: 'Airport Taxi',
    emoji: '✈️',
    description: 'Reliable Bangalore International Airport (BLR) pickup and drop services. We track your flight in real-time to ensure the driver is always ready when you land.',
    features: ['Flight Tracking', 'Meet & Greet', '24/7 Availability', 'Fixed Prices', 'All Terminals', 'No Waiting Charge'],
    vehicles: ['Sedan', 'SUV', 'Innova'],
    pricing: 'Starting ₹780 from city center',
  },
  {
    id: 'city',
    title: 'City Rides',
    emoji: '🏙️',
    description: 'Comfortable local transportation within Bangalore for hourly hire or point-to-point travel. Perfect for shopping trips, medical visits, meetings, or daily commutes.',
    features: ['Hourly Hire Available', 'Point-to-Point', 'Multiple Stops', 'AC Vehicles', 'Trained Drivers', 'Clean Vehicles'],
    vehicles: ['Sedan', 'SUV'],
    pricing: 'Starting ₹99 for first 4km',
  },
  {
    id: 'railway',
    title: 'Railway Station Transfers',
    emoji: '🚂',
    description: 'Reliable cab service to and from Bangalore City Station, Yeshwantpur Junction, and Cantonment Station. We track your train and ensure you reach on time.',
    features: ['Train Tracking', 'All Railway Stations', '24/7 Service', 'Large Luggage Space', 'Fixed Prices', 'Online Booking'],
    vehicles: ['Sedan', 'Innova'],
    pricing: 'Starting ₹299',
  },
  {
    id: 'rental',
    title: 'Car Rental',
    emoji: '🚗',
    description: 'Flexible car hire with professional chauffeur for corporate travel, weddings, events, or extended personal use. Choose from our diverse fleet based on your requirements.',
    features: ['8-Hour & 12-Hour Packages', 'Corporate Accounts', 'GST Invoice', 'Professional Chauffeur', 'Multiple Vehicles', 'Flexible Booking'],
    vehicles: ['Sedan', 'SUV', 'Innova', 'Tempo Traveller'],
    pricing: 'Starting ₹2,500 for 8 hours',
  },
  {
    id: 'tours',
    title: 'Tour Packages',
    emoji: '🏖️',
    description: 'Curated multi-day tour packages from Bangalore to popular destinations across South India including hill stations, beaches, heritage sites, and pilgrimages.',
    features: ['Multiple Destinations', 'Day-wise Itinerary', 'Experienced Drivers', 'All Tolls Included', 'Driver Batta Included', '24/7 Support'],
    vehicles: ['Sedan', 'SUV', 'Innova', 'Tempo Traveller'],
    pricing: 'Starting ₹5,500 per package',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Our Services</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">Comprehensive transportation solutions for every need — from quick airport hops to elaborate multi-day tours across South India.</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {SERVICES_DETAIL.map((s, i) => (
          <div key={s.id} id={s.id} className={`bg-white rounded-2xl shadow-card overflow-hidden flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className={`md:w-2/5 bg-gradient-to-br ${i % 2 === 0 ? 'from-[#1A237E] to-[#283593]' : 'from-[#FF6F00] to-[#FF8F00]'} flex items-center justify-center py-12`}>
              <div className="text-center text-white">
                <span className="text-8xl block mb-4">{s.emoji}</span>
                <p className="font-bold text-2xl">{s.title}</p>
                <p className="text-white/80 text-sm mt-1">{s.pricing}</p>
              </div>
            </div>
            <div className="md:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-[#1A237E] mb-3">{s.title}</h2>
              <p className="text-gray-600 mb-5 leading-relaxed">{s.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {s.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {s.vehicles.map(v => <span key={v} className="bg-[#1A237E]/10 text-[#1A237E] text-xs px-3 py-1 rounded-full">{v}</span>)}
              </div>
              <Link href={`/book-a-cab?service=${s.id}`} className="btn-primary text-sm inline-flex items-center gap-2">
                Book {s.title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
