// src/app/privacy-policy/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy | NV Cabs' };
export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', body: 'We collect your name, mobile number, email address (optional), pickup/drop locations, and trip preferences when you book with us. We also collect device information and usage data to improve our services.' },
    { title: '2. How We Use Your Information', body: 'Your information is used to process bookings, send confirmations, assign drivers, provide customer support, and improve our services. We may also use anonymized data for analytics and service improvement.' },
    { title: '3. Information Sharing', body: 'We share your contact information with our assigned drivers for trip coordination. We do not sell your personal data to third parties. We may share data with payment processors (Razorpay) and SMS service providers (Twilio/MSG91) as necessary for service delivery.' },
    { title: '4. Data Security', body: 'We implement industry-standard security measures including HTTPS/TLS encryption, secure OTP verification, and encrypted storage of sensitive data. However, no internet transmission is 100% secure.' },
    { title: '5. Cookies', body: 'Our website uses cookies to enhance your browsing experience, remember preferences, and analyze website traffic through Google Analytics. You can disable cookies in your browser settings.' },
    { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications. To exercise these rights, email us at support@nvcabs.in.' },
    { title: '7. Contact Us', body: 'For privacy-related queries, contact us at privacy@nvcabs.in or call 9530800800. Our address: Ground Floor, Building No. 62, Gunjur Post, Bengaluru 560087.' },
  ];
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-blue-200">Last updated: April 2026</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-5">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-bold text-[#1A237E] mb-3">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
