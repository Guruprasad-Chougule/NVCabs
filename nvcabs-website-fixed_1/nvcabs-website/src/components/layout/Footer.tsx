// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { getPhoneLink } from '@/lib/utils';

const SERVICES = [
  { label: 'Outstation Cabs', href: '/services#outstation' },
  { label: 'Airport Taxi', href: '/services#airport' },
  { label: 'City Rides', href: '/services#city' },
  { label: 'Railway Transfers', href: '/services#railway' },
  { label: 'Car Rental', href: '/services#rental' },
  { label: 'Tour Packages', href: '/tour-packages' },
];

const POPULAR_ROUTES = [
  { label: 'Bangalore to Ooty', href: '/route/bangalore-to-ooty' },
  { label: 'Bangalore to Coorg', href: '/route/bangalore-to-coorg' },
  { label: 'Bangalore to Mysore', href: '/route/bangalore-to-mysore' },
  { label: 'Bangalore to Tirupati', href: '/route/bangalore-to-tirupati' },
  { label: 'Bangalore to Goa', href: '/route/bangalore-to-goa' },
  { label: 'Airport Transfers', href: '/route/bangalore-airport-transfers' },
];

const QUICK_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Book a Cab', href: '/book-a-cab' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
  { label: 'FAQ', href: '/faq' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D1257] text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#FF6F00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NV</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl">NV Cabs</span>
                <p className="text-gray-400 text-[10px]">South India&apos;s Premier Cab</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Reliable, safe, and comfortable cab services across Bangalore and South India. Available 24/7 for outstation, airport, city rides, and tour packages.
            </p>
            <div className="space-y-3">
              <a href={getPhoneLink('9530800800')} className="flex items-center gap-3 text-sm hover:text-[#FF6F00] transition-colors group">
                <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center group-hover:bg-[#FF6F00] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                9530800800
              </a>
              <a href="mailto:support@nvcabs.in" className="flex items-center gap-3 text-sm hover:text-[#FF6F00] transition-colors group">
                <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center group-hover:bg-[#FF6F00] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                support@nvcabs.in
              </a>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-gray-400 text-xs">Ground Floor, Building No. 62, Beyond Sharada School, Gunjur Post, Halasahalli Thippasandra, Bengaluru 560087</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-[#1A237E] rounded-full flex items-center justify-center hover:bg-[#FF6F00] transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Our Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-gray-400 hover:text-[#FF6F00] transition-colors flex items-center gap-2">
                    <span className="text-[#FF6F00]">›</span> {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular routes */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Popular Routes</h4>
            <ul className="space-y-2.5">
              {POPULAR_ROUTES.map(r => (
                <li key={r.href}>
                  <Link href={r.href} className="text-sm text-gray-400 hover:text-[#FF6F00] transition-colors flex items-center gap-2">
                    <span className="text-[#FF6F00]">›</span> {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-[#FF6F00] transition-colors flex items-center gap-2">
                    <span className="text-[#FF6F00]">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">We accept:</p>
              <div className="flex gap-2 flex-wrap">
                {['UPI', 'Visa', 'Mastercard', 'Cash'].map(p => (
                  <span key={p} className="px-2.5 py-1 bg-[#1A237E] rounded text-xs text-gray-300">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A237E] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} NV Cabs. All rights reserved. | CIN: UXXXXXXXXXX</p>
          <p className="text-center">Made with ❤️ for travelers across South India</p>
        </div>
      </div>
    </footer>
  );
}
