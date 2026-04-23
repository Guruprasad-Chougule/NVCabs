'use client';
// src/app/admin/dashboard/page.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Car, Users, MessageSquare, TrendingUp, Clock, XCircle, Loader2, LogOut, Package } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { DashboardStats, Booking } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setStats(json.data); else setError(json.error.message); })
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => { localStorage.removeItem('adminToken'); router.push('/admin/login'); };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#1A237E] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">{error}</p>
        <button onClick={() => router.push('/admin/login')} className="btn-primary mt-4">Login Again</button>
      </div>
    </div>
  );

  const STAT_CARDS = [
    { title: "Today's Bookings", value: stats?.todayBookings || 0, icon: Car, color: 'bg-blue-500', suffix: '' },
    { title: "Today's Revenue", value: formatCurrency(stats?.todayRevenue || 0), icon: TrendingUp, color: 'bg-green-500', suffix: '' },
    { title: 'Active Trips', value: stats?.activeTrips || 0, icon: Clock, color: 'bg-orange-500', suffix: '' },
    { title: 'Pending Enquiries', value: stats?.pendingEnquiries || 0, icon: MessageSquare, color: 'bg-purple-500', suffix: '' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: BarChart3, color: 'bg-indigo-500', suffix: '' },
    { title: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'bg-teal-500', suffix: '' },
    { title: 'Active Drivers', value: stats?.totalDrivers || 0, icon: Users, color: 'bg-pink-500', suffix: '' },
    { title: 'Active Vehicles', value: stats?.totalVehicles || 0, icon: Car, color: 'bg-yellow-500', suffix: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF6F00] rounded-lg flex items-center justify-center font-bold text-sm">NV</div>
          <div>
            <p className="font-bold">NV Cabs Admin</p>
            <p className="text-xs text-blue-200">Operations Dashboard</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Bookings', href: '/admin/bookings' },
            { label: 'Vehicles', href: '/admin/vehicles' },
            { label: 'Drivers', href: '/admin/drivers' },
            { label: 'Routes', href: '/admin/routes' },
            { label: 'Enquiries', href: '/admin/enquiries' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="px-3 py-2 rounded hover:bg-white/10 transition-colors">{link.label}</Link>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-2 text-sm hover:text-[#FF8F00] transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A237E]">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-xl shadow-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-500 text-xs font-medium">{card.title}</p>
                  <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#1A237E]">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Booking status breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-white rounded-xl shadow-card p-5">
            <h3 className="font-bold text-[#1A237E] mb-4">Bookings by Status</h3>
            <div className="space-y-3">
              {Object.entries(stats?.bookingsByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`badge badge-${status} capitalize`}>{status.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-700">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A237E]">Recent Bookings</h3>
              <Link href="/admin/bookings" className="text-[#FF6F00] text-sm hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-2 text-gray-500 font-medium">Ref</th>
                    <th className="pb-2 text-gray-500 font-medium">Customer</th>
                    <th className="pb-2 text-gray-500 font-medium">Route</th>
                    <th className="pb-2 text-gray-500 font-medium">Status</th>
                    <th className="pb-2 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentBookings || []).slice(0, 6).map((booking: Booking & { user?: { name: string } }) => (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 font-mono text-xs text-[#1A237E]">{booking.bookingRef}</td>
                      <td className="py-2.5">{booking.user?.name || '—'}</td>
                      <td className="py-2.5 text-xs text-gray-500 max-w-[120px] truncate">{booking.dropLocation}</td>
                      <td className="py-2.5">
                        <span className={`badge badge-${booking.status} capitalize text-xs`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-gray-400">{formatDateTime(booking.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-bold text-[#1A237E] mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Manage Bookings', href: '/admin/bookings', icon: BarChart3 },
              { label: 'Manage Vehicles', href: '/admin/vehicles', icon: Car },
              { label: 'Manage Drivers', href: '/admin/drivers', icon: Users },
              { label: 'View Enquiries', href: '/admin/enquiries', icon: MessageSquare },
              { label: 'Manage Routes', href: '/admin/routes', icon: Package },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2 px-4 py-2.5 bg-[#1A237E]/5 hover:bg-[#1A237E] hover:text-white text-[#1A237E] rounded-lg text-sm font-medium transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
