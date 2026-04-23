// src/app/tour-packages/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tour Packages from Bangalore | South India Tours | NV Cabs',
  description: 'Explore curated tour packages from Bangalore. Hill stations, beaches, heritage, pilgrimage tours. Comfortable cabs, experienced drivers. Book now!',
};

const PKG_EMOJIS: Record<string, string> = {
  'Hill Station': '🏔️', 'Beach': '🏖️', 'Heritage': '🗿', 'Pilgrimage': '🛕',
};

export default async function TourPackagesPage() {
  const packages = await prisma.tourPackage.findMany({ where: { isActive: true }, orderBy: { basePrice: 'asc' } }).catch(() => []);

  const categories = ['All', ...Array.from(new Set(packages.map(p => p.category)))];

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Tour Packages from Bangalore</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Curated multi-day tour packages for popular destinations across South India. All packages include comfortable AC cab service.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <span key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-[#1A237E]/10 text-[#1A237E] cursor-pointer hover:bg-[#1A237E] hover:text-white transition-colors">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.slug} className="card group">
              <div className="h-48 bg-gradient-to-br from-[#1A237E] to-[#FF6F00] flex items-center justify-center relative overflow-hidden">
                <span className="text-7xl">{PKG_EMOJIS[pkg.category] || '🚗'}</span>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full">{pkg.category}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-[#FF6F00] text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {pkg.durationDays}D/{pkg.durationNights}N
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-bold text-[#1A237E] mb-2 leading-tight">{pkg.title}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                <div className="space-y-1.5 mb-4">
                  {pkg.highlights.slice(0, 3).map(h => (
                    <div key={h} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="text-[#FF6F00] font-bold text-xl">{formatCurrency(Number(pkg.basePrice))}</p>
                  </div>
                  <Link
                    href={`/tour-packages/${pkg.slug}`}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
