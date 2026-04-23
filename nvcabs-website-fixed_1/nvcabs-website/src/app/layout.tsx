// src/app/layout.tsx
import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.nvcabs.in'),
  title: {
    default: 'NV Cabs - Premier Cab Service in Bangalore & South India',
    template: '%s | NV Cabs',
  },
  description:
    'NV Cabs offers reliable, affordable cab services in Bangalore including outstation trips, airport transfers, city rides, and tour packages across South India. Book now!',
  keywords: [
    'cab service Bangalore', 'taxi Bangalore', 'outstation cab', 'airport taxi Bangalore',
    'Bangalore to Ooty cab', 'Bangalore to Coorg cab', 'tour packages Bangalore',
    'NV Cabs', 'cab booking', 'South India cab',
  ],
  authors: [{ name: 'NV Cabs' }],
  creator: 'NV Cabs',
  publisher: 'NV Cabs',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.nvcabs.in',
    siteName: 'NV Cabs',
    title: 'NV Cabs - Premier Cab Service in Bangalore & South India',
    description: 'Reliable cab services across Bangalore and South India. Book outstation cabs, airport transfers, tour packages and more.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'NV Cabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NV Cabs - Premier Cab Service',
    description: 'Reliable cab services across Bangalore and South India.',
    images: ['/images/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.nvcabs.in' },
  verification: { google: 'your-google-verification-code' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1A237E" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 4000,
            style: { background: '#fff', color: '#1a1a2e', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
            success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
            error: { iconTheme: { primary: '#C62828', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
