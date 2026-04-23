'use client';
// src/components/home/PopularRoutes.tsx
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Route } from '@/types';

// Fallback pricing per route (sedan one-way)
const ROUTE_PRICES: Record<string, number> = {
  'bangalore-to-ooty': 3540,
  'bangalore-to-coorg': 3240,
  'bangalore-to-mysore': 2100,
  'bangalore-to-tirupati': 3240,
  'bangalore-to-pondicherry': 4020,
  'bangalore-to-goa': 7020,
  'bangalore-to-wayanad': 3660,
  'bangalore-to-hampi': 4380,
  'bangalore-airport-transfers': 780,
};

const ROUTE_EMOJIS: Record<string, string> = {
  'bangalore-to-ooty': '🏔️',
  'bangalore-to-coorg': '🌿',
  'bangalore-to-mysore': '🏯',
  'bangalore-to-tirupati': '🛕',
  'bangalore-to-pondicherry': '🌊',
  'bangalore-to-goa': '🏖️',
  'bangalore-to-wayanad': '🌳',
  'bangalore-to-hampi': '🗿',
  'bangalore-airport-transfers': '✈️',
};

export default function PopularRoutes({ routes }: { routes: Route[] }) {
  const displayRoutes = routes.length > 0 ? routes : FALLBACK_ROUTES;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-wide mb-2">Popular Destinations</p>
            <h2 className="section-title mb-0">Top Routes from Bangalore</h2>
          </div>
          <Link href="/routes" className="hidden sm:flex items-center gap-2 text-[#1A237E] font-semibold hover:text-[#FF6F00] transition-colors">
            View All Routes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayRoutes.slice(0, 8).map(route => (
            <Link key={route.slug} href={`/route/${route.slug}`}>
              <div className="card group h-full flex flex-col">
                {/* Image / Emoji placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-[#1A237E] to-[#283593] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl">{ROUTE_EMOJIS[route.slug] || '🚗'}</span>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  {route.isFeatured && (
                    <span className="absolute top-3 right-3 bg-[#FF6F00] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-[#1A237E] mb-2">
                    {route.origin} → {route.destination}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {route.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{route.durationHours}h
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Starts from</p>
                      <p className="text-[#FF6F00] font-bold text-lg">
                        {formatCurrency(ROUTE_PRICES[route.slug] || 2000)}
                      </p>
                    </div>
                    <span className="text-[#1A237E] text-sm font-medium group-hover:text-[#FF6F00] transition-colors flex items-center gap-1">
                      Book <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/routes" className="btn-secondary">
            Explore All Routes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Fallback static routes if DB is empty
const FALLBACK_ROUTES: Route[] = [
  { id: '1', slug: 'bangalore-to-ooty',       origin: 'Bangalore', destination: 'Ooty',       distanceKm: 270, durationHours: 6.5, highlights: [], isFeatured: true },
  { id: '2', slug: 'bangalore-to-coorg',       origin: 'Bangalore', destination: 'Coorg',      distanceKm: 250, durationHours: 5.5, highlights: [], isFeatured: true },
  { id: '3', slug: 'bangalore-to-mysore',      origin: 'Bangalore', destination: 'Mysore',     distanceKm: 150, durationHours: 3,   highlights: [], isFeatured: true },
  { id: '4', slug: 'bangalore-to-tirupati',    origin: 'Bangalore', destination: 'Tirupati',   distanceKm: 250, durationHours: 5,   highlights: [], isFeatured: true },
  { id: '5', slug: 'bangalore-to-pondicherry', origin: 'Bangalore', destination: 'Pondicherry',distanceKm: 310, durationHours: 6,   highlights: [], isFeatured: false },
  { id: '6', slug: 'bangalore-to-goa',         origin: 'Bangalore', destination: 'Goa',        distanceKm: 560, durationHours: 10,  highlights: [], isFeatured: true },
  { id: '7', slug: 'bangalore-to-wayanad',     origin: 'Bangalore', destination: 'Wayanad',    distanceKm: 280, durationHours: 6,   highlights: [], isFeatured: false },
  { id: '8', slug: 'bangalore-airport-transfers', origin: 'Bangalore', destination: 'BLR Airport', distanceKm: 40, durationHours: 1.5, highlights: [], isFeatured: true },
];
