'use client';
// src/app/contact/page.tsx
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) { setSubmitted(true); toast.success('Message sent successfully!'); }
      else toast.error(json.error.message);
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-hero-gradient text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-blue-200">We&apos;re here to help 24/7. Reach out via phone, email, or WhatsApp.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1A237E]">Get in Touch</h2>
            <p className="text-gray-600">Whether you want to book a cab, enquire about our services, or give feedback — we love hearing from our customers.</p>

            {[
              { icon: Phone, title: 'Phone / WhatsApp', value: '9530800800', href: 'tel:9530800800', color: 'bg-blue-50 text-blue-600' },
              { icon: Mail, title: 'Email', value: 'support@nvcabs.in', href: 'mailto:support@nvcabs.in', color: 'bg-orange-50 text-orange-600' },
              { icon: MapPin, title: 'Office Address', value: 'Ground Floor, Building No. 62, Beyond Sharada School, Gunjur Post, Halasahalli Thippasandra, Bengaluru 560087', href: null, color: 'bg-green-50 text-green-600' },
              { icon: Clock, title: 'Operating Hours', value: '24 hours / 7 days a week', href: null, color: 'bg-purple-50 text-purple-600' },
            ].map(({ icon: Icon, title, value, href, color }) => (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A237E] mb-0.5">{title}</p>
                  {href ? (
                    <a href={href} className="text-gray-600 hover:text-[#FF6F00] transition-colors">{value}</a>
                  ) : (
                    <p className="text-gray-600 text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="bg-gray-100 rounded-xl h-52 flex items-center justify-center text-gray-400 mt-4">
              <div className="text-center">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Google Maps — NV Cabs Office, Bengaluru</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }); }} className="btn-primary mt-6">Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#1A237E] mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your name" className="input-field" required />
                    </div>
                    <div>
                      <label className="label">Phone *</label>
                      <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="Mobile number" className="input-field" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="your@email.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <input value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} placeholder="How can we help?" className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} rows={5} placeholder="Tell us more..." className="input-field resize-none" required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
