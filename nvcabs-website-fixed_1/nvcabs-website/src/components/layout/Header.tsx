'use client';
// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn, getPhoneLink } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Outstation Cabs', href: '/services#outstation' },
      { label: 'Airport Taxi', href: '/services#airport' },
      { label: 'City Rides', href: '/services#city' },
      { label: 'Railway Station', href: '/services#railway' },
      { label: 'Car Rental', href: '/services#rental' },
    ],
  },
  { label: 'Tour Packages', href: '/tour-packages' },
  { label: 'Routes', href: '/routes' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] py-2'
          : 'bg-white/95 backdrop-blur-sm py-3'
      )}
    >
      {/* Top bar */}
      <div className="bg-[#1A237E] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>📍 Bengaluru, Karnataka | South India&apos;s Trusted Cab Service</span>
          <div className="flex items-center gap-4">
            <a href="mailto:support@nvcabs.in" className="hover:text-[#FF6F00] transition-colors">
              ✉ support@nvcabs.in
            </a>
            <a href={getPhoneLink('9530800800')} className="hover:text-[#FF6F00] transition-colors font-medium">
              📞 9530800800
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[#1A237E] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NV</span>
            </div>
            <div>
              <span className="text-[#1A237E] font-bold text-xl leading-none">NV Cabs</span>
              <p className="text-gray-500 text-[10px] leading-none">South India&apos;s Premier Cab</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        pathname.startsWith(link.href)
                          ? 'text-[#1A237E] bg-[#1A237E]/10'
                          : 'text-gray-700 hover:text-[#1A237E] hover:bg-gray-50'
                      )}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1A237E]/5 hover:text-[#1A237E] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'text-[#1A237E] bg-[#1A237E]/10'
                        : 'text-gray-700 hover:text-[#1A237E] hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getPhoneLink('9530800800')}
              className="flex items-center gap-2 text-[#1A237E] font-semibold text-sm hover:text-[#FF6F00] transition-colors"
            >
              <Phone className="w-4 h-4" />
              9530800800
            </a>
            <Link href="/book-a-cab" className="btn-primary text-sm py-2.5">
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-[#1A237E]/10 text-[#1A237E]'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-xs text-gray-600 hover:text-[#1A237E]"
                      >
                        → {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 pb-2 flex flex-col gap-2">
              <a href={getPhoneLink('9530800800')} className="btn-secondary justify-center text-sm">
                <Phone className="w-4 h-4" /> Call 9530800800
              </a>
              <Link href="/book-a-cab" className="btn-primary justify-center text-sm">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
