// src/app/about-us/page.tsx
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'About NV Cabs | Premier Cab Service Bangalore',
  description: 'Learn about NV Cabs — Bangalore\'s trusted cab service provider since 2019. Our mission, values, fleet, and team.',
};

const VALUES = [
  { title: 'Customer Satisfaction', desc: 'Every decision we make is driven by what\'s best for our customers. Your comfort and satisfaction are our primary goals.', icon: '🤝' },
  { title: 'Safety', desc: 'We maintain the highest safety standards — from vehicle maintenance to driver training and real-time trip monitoring.', icon: '🛡️' },
  { title: 'Reliability', desc: 'We understand the importance of punctuality. Our drivers are trained to be on time, every time.', icon: '⏰' },
  { title: 'Innovation', desc: 'We continuously improve our technology, processes, and service offerings to deliver better experiences.', icon: '💡' },
  { title: 'Professionalism', desc: 'From our drivers to our support team, every NV Cabs team member upholds the highest professional standards.', icon: '⭐' },
  { title: 'Transparency', desc: 'No hidden charges. Clear pricing, straightforward policies, and honest communication at all times.', icon: '🔍' },
];

const MILESTONES = [
  { year: '2019', event: 'NV Cabs founded in Bengaluru with 5 vehicles' },
  { year: '2020', event: 'Expanded fleet to 20 vehicles. Launched airport transfer service' },
  { year: '2021', event: 'Crossed 1,000 happy customers. Added Tempo Traveller fleet' },
  { year: '2022', event: 'Launched tour packages. Expanded to 30+ destinations' },
  { year: '2023', event: 'Reached 5,000+ bookings. Partnership with 50+ corporate clients' },
  { year: '2024', event: 'Launched online booking platform. Crossed 10,000 trips milestone' },
  { year: '2026', event: 'New website launch with enhanced booking experience' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About NV Cabs</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Bangalore&apos;s most trusted cab service, delivering exceptional transportation experiences since 2019.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#1A237E] text-white rounded-2xl p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-blue-100 leading-relaxed">
              To provide top-notch cab services that exceed customer expectations through safety, reliability, and professionalism. We aim to make every journey comfortable, affordable, and memorable.
            </p>
          </div>
          <div className="bg-[#FF6F00] text-white rounded-2xl p-8">
            <div className="text-4xl mb-4">🔭</div>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-orange-100 leading-relaxed">
              To become the preferred choice for transportation in Bangalore and South India — a brand synonymous with trust, comfort, and world-class service for every Indian traveler.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#1A237E] mb-4">Our Story</h2>
          <div className="prose text-gray-600 max-w-none space-y-4">
            <p>NV Cabs was founded in 2019 with a simple but powerful vision: to provide Bangalore&apos;s residents and visitors with a cab service they could truly rely on. Starting with just 5 vehicles and a passionate team, we set out to redefine what cab service means in South India.</p>
            <p>What began as a small outstation cab service quickly grew as word spread about our reliable drivers, clean vehicles, transparent pricing, and exceptional customer support. We expanded our fleet, our routes, and our team — always keeping our commitment to customer satisfaction at the heart of every decision.</p>
            <p>Today, NV Cabs proudly serves 10,000+ customers across Bangalore and South India, operating a fleet of 50+ vehicles ranging from sedans to mini buses. We operate 24/7, 365 days a year, handling everything from quick airport transfers to elaborate multi-day tour packages.</p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1A237E] text-center mb-8">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-xl shadow-card p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-[#1A237E] mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1A237E] text-center mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#1A237E]/20" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-1/2 pl-10 md:pl-0 md:pr-8 md:text-right">
                    {i % 2 === 0 && (
                      <div className="bg-white rounded-xl shadow-card p-4">
                        <span className="text-[#FF6F00] font-bold text-lg">{m.year}</span>
                        <p className="text-gray-600 text-sm mt-1">{m.event}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-2 md:left-1/2 top-4 w-5 h-5 bg-[#1A237E] rounded-full border-2 border-white shadow md:-translate-x-2.5" />
                  <div className="md:w-1/2 pl-10 md:pl-8">
                    {i % 2 !== 0 && (
                      <div className="bg-white rounded-xl shadow-card p-4">
                        <span className="text-[#FF6F00] font-bold text-lg">{m.year}</span>
                        <p className="text-gray-600 text-sm mt-1">{m.event}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#1A237E] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-8">NV Cabs by Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '50+', label: 'Vehicles in Fleet' },
              { value: '30+', label: 'Destinations Covered' },
              { value: '5+', label: 'Years of Service' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#FF8F00]">{s.value}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
