'use client';
// src/app/admin/routes/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Route } from '@/types';

export default function AdminRoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchRoutes = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/routes?limit=50', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setRoutes(json.data);
    } catch { toast.error('Failed to load routes'); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const EMOJIS: Record<string, string> = {
    'bangalore-to-ooty': '🏔️', 'bangalore-to-coorg': '🌿', 'bangalore-to-mysore': '🏯',
    'bangalore-to-tirupati': '🛕', 'bangalore-to-pondicherry': '🌊', 'bangalore-to-goa': '🏖️',
    'bangalore-to-wayanad': '🌳', 'bangalore-to-hampi': '🗿', 'bangalore-airport-transfers': '✈️',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">Manage Routes</h1>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
          <strong>Note:</strong> Routes can be managed via the database seed or Prisma Studio. Run <code className="bg-white px-1 rounded">npm run db:studio</code> to manage routes directly.
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Route', 'Distance', 'Duration', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span>{EMOJIS[r.slug] || '🚗'}</span>
                        <div>
                          <p className="font-medium text-gray-800">{r.origin} → {r.destination}</p>
                          <p className="text-xs text-gray-400 font-mono">/route/{r.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{r.distanceKm} km</td>
                    <td className="py-3.5 px-4 text-gray-600">~{r.durationHours}h</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${r.isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link href={`/route/${r.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-[#1A237E] hover:text-[#FF6F00]">
                        <ExternalLink className="w-3.5 h-3.5" /> View Page
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
