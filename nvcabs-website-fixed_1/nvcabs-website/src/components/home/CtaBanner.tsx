// src/components/home/CtaBanner.tsx
import Link from 'next/link';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { getPhoneLink, getWhatsAppLink } from '@/lib/utils';

export default function CtaBanner() {
  const whatsappMsg = 'Hello NV Cabs! I want to book a cab. Please assist me.';
  return (
    <section className="bg-gradient-to-r from-[#FF6F00] to-[#FF8F00] py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Travel? Book Your Cab in 60 Seconds!
        </h2>
        <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
          Join 10,000+ satisfied customers who trust NV Cabs for comfortable, safe, and affordable travel across South India.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/book-a-cab" className="bg-white text-[#FF6F00] font-bold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 shadow-lg">
            Book a Cab Now <ArrowRight className="w-5 h-5" />
          </Link>
          <a href={getPhoneLink('9530800800')} className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
            <Phone className="w-5 h-5" /> Call 9530800800
          </a>
          <a href={getWhatsAppLink('9530800800', whatsappMsg)} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#1ebe5d] transition-colors flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
