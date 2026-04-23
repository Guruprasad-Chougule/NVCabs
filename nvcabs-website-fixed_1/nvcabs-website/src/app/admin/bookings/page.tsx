'use client';
// src/app/admin/bookings/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, RefreshCw, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Booking } from '@/types';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

type BookingWithRelations = Booking & {
  user?: { name: string; phone: string };
  vehicle?: { type: string; model: string };
  driver?: { user: { name: string; phone: string } };
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setTotalPages(json.meta.totalPages);
        setTotal(json.meta.total);
      }
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  }, [page, search, statusFilter, router]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Status updated');
        fetchBookings();
      } else toast.error(json.error.message);
    } catch { toast.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="hover:text-blue-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">Manage Bookings</h1>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{total} total</span>
        </div>
        <button onClick={fetchBookings} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ref, name, phone..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field text-sm w-40"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Booking Ref', 'Customer', 'Route', 'Pickup', 'Vehicle', 'Fare', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold text-xs uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">No bookings found</td></tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs text-[#1A237E] font-semibold">{b.bookingRef}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{formatDateTime(b.createdAt)}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-gray-800">{b.user?.name}</p>
                          <p className="text-xs text-gray-400">{b.user?.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[140px]">
                          <p className="truncate">{b.pickupLocation}</p>
                          <p className="truncate text-gray-400">→ {b.dropLocation}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                          {formatDateTime(b.pickupDatetime)}
                          <p className="text-gray-400 capitalize">{b.tripType.replace('_', ' ')}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600 capitalize">
                          {b.vehicle ? `${b.vehicle.type.replace('_', ' ')}` : '—'}
                          {b.driver && <p className="text-gray-400">{b.driver.user.name}</p>}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#FF6F00]">
                            {b.estimatedFare ? formatCurrency(Number(b.estimatedFare)) : '—'}
                          </p>
                          <p className={`text-[10px] capitalize ${b.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-400'}`}>
                            {b.paymentStatus}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                            {b.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={b.status}
                            onChange={e => updateStatus(b.id, e.target.value)}
                            disabled={updatingId === b.id}
                            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A237E] cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.filter(o => o.value).map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
