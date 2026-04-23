'use client';
// src/app/admin/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem('adminToken', json.data.token);
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error(json.error.message || 'Invalid credentials');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A237E] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A237E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">NV</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">NV Cabs Operations Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
              placeholder="9530800800"
              className="input-field"
              required
              maxLength={10}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter password"
                className="input-field pr-10"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-gray-500">
          <p className="font-semibold text-[#1A237E] mb-1">Demo Credentials:</p>
          <p>Phone: <code className="bg-white px-1 rounded">9530800800</code></p>
          <p>Password: <code className="bg-white px-1 rounded">Admin@NVCabs2024</code></p>
        </div>
      </div>
    </div>
  );
}
