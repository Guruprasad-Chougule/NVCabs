'use client';
// src/app/admin/drivers/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

type DriverEntry = {
  id: string;
  licenseNumber: string;
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
  user: { name: string; phone: string };
  vehicle?: { type: string; model: string; registrationNo: string };
};

export default function AdminDriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<DriverEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/drivers', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setDrivers(json.data);
      else setDrivers([]);
    } catch {
      setDrivers([]);
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-bold text-lg">Manage Drivers</h1>
      </header>

      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
          <strong>Note:</strong> Full driver management coming soon. Drivers can be added via Prisma Studio: <code className="bg-white px-1 rounded">npm run db:studio</code>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" /></div>
        ) : drivers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center text-gray-400">
            <p className="text-lg mb-2">No drivers found</p>
            <p className="text-sm">Seed the database to add sample drivers</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {drivers.map(d => (
              <div key={d.id} className="bg-white rounded-xl shadow-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {d.user.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A237E]">{d.user.name}</h3>
                    <a href={`tel:${d.user.phone}`} className="text-sm text-gray-500 flex items-center gap-1 hover:text-[#FF6F00]">
                      <Phone className="w-3 h-3" />{d.user.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>License</span>
                    <span className="font-mono text-xs">{d.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Experience</span>
                    <span>{d.experienceYears} years</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Rating</span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {Number(d.rating).toFixed(1)}
                    </span>
                  </div>
                  {d.vehicle && (
                    <div className="flex justify-between text-gray-600">
                      <span>Vehicle</span>
                      <span className="text-xs">{d.vehicle.model} ({d.vehicle.registrationNo})</span>
                    </div>
                  )}
                </div>
                <div className={`mt-4 px-3 py-1.5 rounded-lg text-xs font-medium text-center ${d.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {d.isAvailable ? '✅ Available' : '🔴 Unavailable'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
