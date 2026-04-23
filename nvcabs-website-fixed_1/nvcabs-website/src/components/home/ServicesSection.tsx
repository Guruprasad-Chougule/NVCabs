// src/components/home/ServicesSection.tsx
import Link from 'next/link';
import { Plane, MapPin, Clock, Train, Car, Map } from 'lucide-react';

const SERVICES = [
  {
    icon: MapPin,
    title: 'Outstation Cabs',
    description: 'One-way and round-trip cab services to destinations across South India. Transparent pricing.',
    href: '/services#outstation',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Plane,
    title: 'Airport Taxi',
    description: 'Timely pickups and drops at Kempegowda International Airport (BLR) — flight tracking included.',
    href: '/services#airport',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Clock,
    title: 'City Rides',
    description: 'Hourly or point-to-point rides within Bangalore. Perfect for meetings, shopping, and daily commutes.',
    href: '/services#city',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Train,
    title: 'Railway Transfers',
    description: 'Comfortable cab service to and from Bangalore City, Yeshwantpur, and Cantonment stations.',
    href: '/services#railway',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Car,
    title: 'Car Rental',
    description: 'Flexible car hire with professional chauffeur. Perfect for corporate travel and special occasions.',
    href: '/services#rental',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Map,
    title: 'Tour Packages',
    description: 'Curated multi-day tour packages to hill stations, beaches, heritage sites and pilgrimages.',
    href: '/tour-packages',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

export default function ServicesSection() {
  return (
    <section className="section-padding bg-white" id="services">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-wide mb-2">What We Offer</p>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle mt-3">
            Comprehensive cab solutions for every travel need — from quick city hops to elaborate tour packages across South India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="card p-6 group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 ${service.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-[#1A237E] mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <Link
                  href={service.href}
                  className="text-[#FF6F00] text-sm font-semibold hover:gap-3 flex items-center gap-2 transition-all group/link"
                >
                  Learn More
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
