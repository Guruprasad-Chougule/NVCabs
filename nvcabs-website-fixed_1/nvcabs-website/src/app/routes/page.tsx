// src/app/routes/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Cab Routes from Bangalore | Outstation Trips | NV Cabs',
  description: 'Explore all cab routes from Bangalore to popular destinations across South India. Compare prices, distances, and book outstation cabs instantly.',
};

const PRICING: Record<string, number> = {
  'bangalore-to-ooty': 3540, 'bangalore-to-coorg': 3240, 'bangalore-to-mysore': 2100,
  'bangalore-to-tirupati': 3240, 'bangalore-to-pondicherry': 4020, 'bangalore-to-goa': 7020,
  'bangalore-to-wayanad': 3660, 'bangalore-to-hampi': 4380, 'bangalore-airport-transfers': 780,
};

const EMOJIS: Record<string, string> = {
  'bangalore-to-ooty': '🏔️', 'bangalore-to-coorg': '🌿', 'bangalore-to-mysore': '🏯',
  'bangalore-to-tirupati': '🛕', 'bangalore-to-pondicherry': '🌊', 'bangalore-to-goa': '🏖️',
  'bangalore-to-wayanad': '🌳', 'bangalore-to-hampi': '🗿', 'bangalore-airport-transfers': '✈️',
};

export default async function RoutesPage() {
  const routes = await prisma.route.findMany({ orderBy: [{ isFeatured: 'desc' }, { destination: 'asc' }] }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Cab Routes from Bangalore</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Explore all popular outstation cab routes from Bangalore. Book comfortable AC cabs to hill stations, beaches, heritage sites, and pilgrimages.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {routes.map(route => (
            <Link key={route.slug} href={`/route/${route.slug}`}>
              <div className="card group h-full flex flex-col">
                <div className="h-36 bg-gradient-to-br from-[#1A237E] to-[#283593] flex items-center justify-center relative">
                  <span className="text-5xl">{EMOJIS[route.slug] || '🚗'}</span>
                  {route.isFeatured && (
                    <span className="absolute top-2 right-2 bg-[#FF6F00] text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-semibold text-[#1A237E] mb-2">{route.origin} → {route.destination}</h2>
                  <div className="flex gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{Number(route.distanceKm)} km</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~{Number(route.durationHours)}h</span>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[#FF6F00] font-bold">{formatCurrency(PRICING[route.slug] || 2000)}</span>
                    <span className="text-[#1A237E] text-sm flex items-center gap-1 group-hover:text-[#FF6F00] transition-colors">
                      Book <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
