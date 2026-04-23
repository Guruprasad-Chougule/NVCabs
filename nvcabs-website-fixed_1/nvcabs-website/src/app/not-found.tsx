// src/app/not-found.tsx
import Link from 'next/link';
import { Home, Phone, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🚗</div>
        <h1 className="text-6xl font-bold text-[#1A237E] mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Looks like this road doesn&apos;t exist! The page you&apos;re looking for may have moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/book-a-cab" className="btn-secondary">
            Book a Cab <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:9530800800" className="btn-ghost border border-gray-200">
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
