'use client';
// src/app/admin/enquiries/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, RefreshCw, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateTime } from '@/lib/utils';
import { Enquiry, EnquiryStatus } from '@/types';

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  responded: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
};

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchEnquiries = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (filter) params.set('status', filter);
      const res = await fetch(`/api/admin/enquiries?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setEnquiries(json.data);
    } catch { toast.error('Failed to load enquiries'); }
    finally { setLoading(false); }
  }, [filter, router]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/enquiries?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) { toast.success('Status updated'); fetchEnquiries(); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">Enquiries</h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="text-sm bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={fetchEnquiries} className="p-2 hover:bg-white/10 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" /></div>
        ) : (
          <div className="space-y-4">
            {enquiries.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-400">No enquiries found</div>
            ) : (
              enquiries.map(e => (
                <div key={e.id} className="bg-white rounded-xl shadow-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-[#1A237E]">{e.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[e.status]}`}>{e.status}</span>
                      </div>
                      <p className="font-medium text-gray-700 text-sm mb-1">{e.subject}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-[#FF6F00]"><Mail className="w-3 h-3" />{e.email}</a>
                        <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-[#FF6F00]"><Phone className="w-3 h-3" />{e.phone}</a>
                        <span>{formatDateTime(e.createdAt)}</span>
                      </div>
                    </div>
                    <select
                      value={e.status}
                      onChange={e2 => updateStatus(e.id, e2.target.value)}
                      className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white flex-shrink-0"
                    >
                      <option value="new">New</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{e.message}</p>
                  <div className="flex gap-2 mt-3">
                    <a href={`mailto:${e.email}?subject=Re: ${e.subject}`} className="text-xs bg-[#1A237E] text-white px-3 py-1.5 rounded-lg hover:bg-[#283593] transition-colors">Reply via Email</a>
                    <a href={`tel:${e.phone}`} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Call Customer</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
