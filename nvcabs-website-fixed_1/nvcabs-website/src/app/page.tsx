// src/app/page.tsx
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PopularRoutes from '@/components/home/PopularRoutes';
import FleetSection from '@/components/home/FleetSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaBanner from '@/components/home/CtaBanner';
import StatsSection from '@/components/home/StatsSection';
import prisma from '@/lib/prisma';
import { Route, Review } from '@/types';

export const metadata: Metadata = {
  title: 'NV Cabs - Reliable Cab Services in Bangalore & South India',
  description: 'Book outstation cabs, airport taxis, city rides and tour packages from Bangalore. Trusted cab service across South India with 24/7 support. Call 9530800800.',
};

async function getHomeData(): Promise<{ routes: Route[]; reviews: (Review & { user: { name: string } })[] }> {
  try {
    const [routes, reviews] = await Promise.all([
      prisma.route.findMany({ where: { isFeatured: true }, take: 8, orderBy: { destination: 'asc' } }),
      prisma.review.findMany({ where: { isApproved: true }, take: 8, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } }),
    ]);

    // Serialize Prisma Decimal → number and Date → string so plain objects pass to client components
    const serializedRoutes: Route[] = routes.map(r => ({
      ...r,
      distanceKm: Number(r.distanceKm),
      durationHours: Number(r.durationHours),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    const serializedReviews = reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return { routes: serializedRoutes, reviews: serializedReviews };
  } catch {
    return { routes: [], reviews: [] };
  }
}

export default async function HomePage() {
  const { routes, reviews } = await getHomeData();

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <WhyChooseUs />
      <PopularRoutes routes={routes} />
      <FleetSection />
      <TestimonialsSection reviews={reviews} />
      <CtaBanner />
    </>
  );
}
