// src/components/home/FleetSection.tsx
import Link from 'next/link';
import { Users, Wind, Star } from 'lucide-react';

const FLEET = [
  {
    type: 'Sedan',
    model: 'Maruti Dzire / Honda Amaze',
    capacity: 4,
    ac: true,
    ratePerKm: '₹12/km',
    features: ['AC', '4 Seater', 'Comfortable Boot'],
    emoji: '🚗',
    color: 'from-blue-500 to-blue-700',
    popular: false,
  },
  {
    type: 'SUV',
    model: 'Toyota Fortuner / Mahindra Scorpio',
    capacity: 6,
    ac: true,
    ratePerKm: '₹18/km',
    features: ['AC', '6 Seater', 'Large Boot', 'Premium'],
    emoji: '🚙',
    color: 'from-indigo-500 to-indigo-700',
    popular: false,
  },
  {
    type: 'Innova Crysta',
    model: 'Toyota Innova Crysta',
    capacity: 7,
    ac: true,
    ratePerKm: '₹16/km',
    features: ['AC', '7 Seater', 'Most Popular', 'Premium'],
    emoji: '🚐',
    color: 'from-[#1A237E] to-[#283593]',
    popular: true,
  },
  {
    type: 'Tempo Traveller',
    model: 'Force Tempo Traveller',
    capacity: 14,
    ac: true,
    ratePerKm: '₹25/km',
    features: ['AC', '12-14 Seater', 'Group Travel'],
    emoji: '🚌',
    color: 'from-orange-500 to-orange-700',
    popular: false,
  },
  {
    type: 'Mini Bus',
    model: 'Tata Winger / Marcopolo',
    capacity: 22,
    ac: true,
    ratePerKm: '₹35/km',
    features: ['AC', '20-22 Seater', 'Corporate'],
    emoji: '🚍',
    color: 'from-green-500 to-green-700',
    popular: false,
  },
];

export default function FleetSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-wide mb-2">Our Fleet</p>
          <h2 className="section-title">Choose Your Perfect Ride</h2>
          <p className="section-subtitle mt-3">
            From economy sedans to large mini buses — we have the right vehicle for every group size and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {FLEET.map(vehicle => (
            <div key={vehicle.type} className="relative card overflow-visible group">
              {vehicle.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6F00] text-white text-xs font-bold px-4 py-1 rounded-full z-10 flex items-center gap-1 whitespace-nowrap">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <div className={`h-28 bg-gradient-to-br ${vehicle.color} flex items-center justify-center`}>
                <span className="text-5xl">{vehicle.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A237E] text-base mb-0.5">{vehicle.type}</h3>
                <p className="text-xs text-gray-500 mb-3">{vehicle.model}</p>
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {vehicle.capacity}</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> AC</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {vehicle.features.map(f => (
                    <span key={f} className="text-[10px] bg-[#1A237E]/10 text-[#1A237E] px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400">Starting</p>
                    <p className="text-[#FF6F00] font-bold">{vehicle.ratePerKm}</p>
                  </div>
                  <Link href={`/book-a-cab?vehicle=${vehicle.type.toLowerCase().replace(' ', '_')}`} className="text-xs bg-[#1A237E] text-white px-3 py-1.5 rounded-md hover:bg-[#FF6F00] transition-colors">
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
