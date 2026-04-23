// src/app/tour-packages/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, ArrowRight, Phone } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pkg = await prisma.tourPackage.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!pkg) return { title: 'Package Not Found' };
  return {
    title: `${pkg.title} | NV Cabs Tour Packages`,
    description: `${pkg.title}. ${pkg.durationDays} days / ${pkg.durationNights} nights. Starting from ${formatCurrency(Number(pkg.basePrice))}. Book now!`,
  };
}

export async function generateStaticParams() {
  const packages = await prisma.tourPackage.findMany({ select: { slug: true } }).catch(() => []);
  return packages.map(p => ({ slug: p.slug }));
}

const PKG_EMOJIS: Record<string, string> = {
  'Hill Station': '🏔️', 'Beach': '🏖️', 'Heritage': '🗿', 'Pilgrimage': '🛕',
};

export default async function TourPackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await prisma.tourPackage.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!pkg) notFound();

  const relatedPackages = await prisma.tourPackage.findMany({
    where: { slug: { not: pkg.slug }, category: pkg.category, isActive: true },
    take: 3,
  }).catch(() => []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white">Home</Link> &rsaquo;{' '}
            <Link href="/tour-packages" className="hover:text-white">Tour Packages</Link> &rsaquo;{' '}
            <span className="text-white">{pkg.destination}</span>
          </nav>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">{PKG_EMOJIS[pkg.category] || '🚗'}</span>
            </div>
            <div>
              <span className="bg-[#FF6F00] text-white text-xs px-3 py-1 rounded-full mb-3 inline-block">{pkg.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{pkg.title}</h1>
              <div className="flex flex-wrap gap-4 text-blue-200 text-sm">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                <span>📍 {pkg.destination}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-bold text-[#1A237E] mb-4">Package Overview</h2>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Highlights */}
            {pkg.highlights.length > 0 && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="text-xl font-bold text-[#1A237E] mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-2 text-gray-700">
                      <div className="w-6 h-6 bg-[#FF6F00] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">★</span>
                      </div>
                      <span className="text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid sm:grid-cols-2 gap-6">
              {pkg.inclusions.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> What&apos;s Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions.length > 0 && (
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> What&apos;s Not Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#1A237E] text-white rounded-xl p-6 sticky top-24">
              <p className="text-blue-200 text-sm mb-1">Package Price</p>
              <p className="text-4xl font-bold text-[#FF8F00] mb-1">{formatCurrency(Number(pkg.basePrice))}</p>
              <p className="text-blue-200 text-xs mb-5">per cab (cab charges only)</p>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between"><span className="text-blue-200">Duration</span><span>{pkg.durationDays}D / {pkg.durationNights}N</span></div>
                <div className="flex justify-between"><span className="text-blue-200">Destination</span><span>{pkg.destination}</span></div>
                <div className="flex justify-between"><span className="text-blue-200">Category</span><span>{pkg.category}</span></div>
              </div>
              <Link
                href={`/book-a-cab?drop=${encodeURIComponent(pkg.destination)}&service=tour`}
                className="block text-center bg-[#FF6F00] hover:bg-[#FF8F00] text-white font-semibold py-3 rounded-lg transition-colors mb-3"
              >
                Book This Package <ArrowRight className="w-4 h-4 inline" />
              </Link>
              <a href="tel:9530800800" className="block text-center border border-white/30 hover:bg-white/10 text-white py-3 rounded-lg transition-colors text-sm">
                <Phone className="w-4 h-4 inline mr-1" /> Call to Customize
              </a>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-1">💡 Pro Tip</p>
              <p className="text-amber-700">Call us to customize this package — add hotel bookings, sightseeing guides, and more!</p>
            </div>
          </div>
        </div>

        {/* Related packages */}
        {relatedPackages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1A237E] mb-6">More {pkg.category} Packages</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedPackages.map(p => (
                <Link key={p.slug} href={`/tour-packages/${p.slug}`} className="card p-5 group">
                  <span className="text-3xl block mb-3">{PKG_EMOJIS[p.category] || '🚗'}</span>
                  <h3 className="font-semibold text-[#1A237E] group-hover:text-[#FF6F00] transition-colors mb-1 text-sm">{p.title}</h3>
                  <p className="text-[#FF6F00] font-bold">{formatCurrency(Number(p.basePrice))}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
