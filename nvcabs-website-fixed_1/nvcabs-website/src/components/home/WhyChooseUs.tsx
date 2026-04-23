// src/components/home/WhyChooseUs.tsx
import { Shield, Clock, UserCheck, Headphones, CreditCard, MapPin } from 'lucide-react';

const REASONS = [
  { icon: Shield,      title: 'Safety First',           desc: 'All vehicles GPS tracked. Verified & trained professional drivers. Regular vehicle maintenance.' },
  { icon: Clock,       title: 'Always On Time',         desc: 'We value your time. Real-time traffic monitoring ensures you never miss a flight or meeting.' },
  { icon: UserCheck,   title: 'Expert Drivers',         desc: 'Our drivers are verified, experienced, and courteous. Average 5+ years of professional experience.' },
  { icon: Headphones,  title: '24/7 Support',           desc: 'Round-the-clock customer support via phone, WhatsApp, and email. We\'re always here for you.' },
  { icon: CreditCard,  title: 'Transparent Pricing',    desc: 'No hidden charges. Detailed fare breakdowns. Multiple payment options including UPI and cash.' },
  { icon: MapPin,      title: 'Pan South India',        desc: 'Serving Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala and Goa from Bangalore.' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-wide mb-2">Why NV Cabs?</p>
          <h2 className="section-title">Your Trust, Our Priority</h2>
          <p className="section-subtitle mt-3">
            We go beyond just driving you from point A to B. Every journey is crafted for your comfort and safety.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group">
              <div className="w-12 h-12 bg-[#1A237E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FF6F00] transition-colors">
                <Icon className="w-6 h-6 text-[#1A237E] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1A237E] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
