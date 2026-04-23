// src/app/route/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

const PRICING_TABLE = [
  { vehicle: 'Sedan (4 Seater)', ratePerKm: 12, baseFare: 300 },
  { vehicle: 'SUV (6 Seater)', ratePerKm: 18, baseFare: 500 },
  { vehicle: 'Innova Crysta (7 Seater)', ratePerKm: 16, baseFare: 400 },
  { vehicle: 'Tempo Traveller (14 Seater)', ratePerKm: 25, baseFare: 800 },
];

const ROUTE_EMOJIS: Record<string, string> = {
  'bangalore-to-ooty': '🏔️', 'bangalore-to-coorg': '🌿',
  'bangalore-to-mysore': '🏯', 'bangalore-to-tirupati': '🛕',
  'bangalore-to-pondicherry': '🌊', 'bangalore-to-goa': '🏖️',
  'bangalore-to-wayanad': '🌳', 'bangalore-to-hampi': '🗿',
  'bangalore-airport-transfers': '✈️',
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const route = await prisma.route.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!route) return { title: 'Route Not Found' };
  return {
    title: route.metaTitle || `${route.origin} to ${route.destination} Cab | NV Cabs`,
    description: route.metaDesc || `Book cab from ${route.origin} to ${route.destination}. ${route.distanceKm}km journey. AC vehicles available. Call 9530800800.`,
  };
}

export async function generateStaticParams() {
  const routes = await prisma.route.findMany({ select: { slug: true } }).catch(() => []);
  return routes.map(r => ({ slug: r.slug }));
}

export default async function RouteDetailPage({ params }: { params: { slug: string } }) {
  const route = await prisma.route.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!route) notFound();

  const relatedRoutes = await prisma.route.findMany({
    where: { slug: { not: route.slug }, isFeatured: true },
    take: 3,
  }).catch(() => []);

  const distanceKm = Number(route.distanceKm);
  const durationHours = Number(route.durationHours);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white">Home</Link> &rsaquo;{' '}
            <Link href="/routes" className="hover:text-white">Routes</Link> &rsaquo;{' '}
            <span className="text-white">{route.origin} to {route.destination}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{ROUTE_EMOJIS[route.slug] || '🚗'}</span>
            <div>
              <h1 className="text-4xl font-bold">{route.origin} to {route.destination} Cab</h1>
              <div className="flex gap-4 mt-2 text-blue-200 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{distanceKm} km</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />~{durationHours}h journey</span>
              </div>
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl">{route.description}</p>
          <div className="flex gap-4 mt-6 flex-wrap">
            <Link href={`/book-a-cab?pickup=${encodeURIComponent(route.origin)}&drop=${encodeURIComponent(route.destination)}`} className="btn-primary">
              Book This Route <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:9530800800" className="btn-outline-white">
              <Phone className="w-4 h-4" /> Call to Book
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Pricing table */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-[#1A237E] mb-5">Fare Estimates</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-gray-600 font-semibold">Vehicle</th>
                      <th className="text-right py-3 px-2 text-gray-600 font-semibold">One Way</th>
                      <th className="text-right py-3 px-2 text-gray-600 font-semibold">Round Trip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING_TABLE.map(row => {
                      const oneWay = Math.round(row.baseFare + distanceKm * row.ratePerKm * 1.05);
                      const roundTrip = Math.round((row.baseFare + distanceKm * 2 * row.ratePerKm) * 1.05);
                      return (
                        <tr key={row.vehicle} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3.5 px-2 font-medium text-gray-700">{row.vehicle}</td>
                          <td className="py-3.5 px-2 text-right text-[#FF6F00] font-semibold">{formatCurrency(oneWay)}</td>
                          <td className="py-3.5 px-2 text-right text-[#FF6F00] font-semibold">{formatCurrency(roundTrip)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">* Inclusive of GST. Toll charges extra. Prices may vary based on pickup time.</p>
            </div>

            {/* Highlights */}
            {route.highlights.length > 0 && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="text-xl font-bold text-[#1A237E] mb-5">Places to Visit in {route.destination}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {route.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-[#1A237E] mb-4">Route Map</h2>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Map showing {route.origin} → {route.destination}</p>
                  <p className="text-xs mt-1">Google Maps integration requires API key</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#1A237E] text-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Book This Trip</h3>
              <p className="text-blue-200 text-sm mb-4">{route.origin} → {route.destination}</p>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between"><span className="text-blue-200">Distance</span><span>{distanceKm} km</span></div>
                <div className="flex justify-between"><span className="text-blue-200">Duration</span><span>~{durationHours}h</span></div>
                <div className="flex justify-between"><span className="text-blue-200">Starting from</span><span className="text-[#FF8F00] font-bold text-lg">{formatCurrency(Math.round(300 + distanceKm * 12 * 1.05))}</span></div>
              </div>
              <Link
                href={`/book-a-cab?pickup=${encodeURIComponent(route.origin)}&drop=${encodeURIComponent(route.destination)}`}
                className="block text-center bg-[#FF6F00] hover:bg-[#FF8F00] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Book Now
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-card p-5">
              <h4 className="font-semibold text-[#1A237E] mb-3">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">Call us for instant booking and support</p>
              <a href="tel:9530800800" className="btn-primary text-sm w-full justify-center"><Phone className="w-4 h-4" /> 9530800800</a>
            </div>
          </div>
        </div>

        {/* Related routes */}
        {relatedRoutes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1A237E] mb-6">Other Popular Routes</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedRoutes.map(r => (
                <Link key={r.slug} href={`/route/${r.slug}`} className="card p-4 group">
                  <h3 className="font-semibold text-[#1A237E] group-hover:text-[#FF6F00] transition-colors mb-1">
                    {r.origin} → {r.destination}
                  </h3>
                  <p className="text-xs text-gray-500">{Number(r.distanceKm)} km · ~{Number(r.durationHours)}h</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
