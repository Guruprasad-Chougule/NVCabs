'use client';
// src/app/admin/vehicles/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2, Pencil, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import { Vehicle, VehicleType } from '@/types';
import { VEHICLE_LABELS } from '@/lib/utils';

const VEHICLE_TYPES: VehicleType[] = ['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus'];
const EMOJIS: Record<VehicleType, string> = { sedan: '🚗', suv: '🚙', innova: '🚐', tempo_traveller: '🚌', mini_bus: '🚍' };

const EMPTY_FORM = { type: 'sedan' as VehicleType, make: '', model: '', registrationNo: '', capacity: 4, ac: true, ratePerKm: 12, ratePerDay: 3000, isActive: true };

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const getToken = () => {
    const t = localStorage.getItem('adminToken');
    if (!t) { router.push('/admin/login'); return null; }
    return t;
  };

  const fetchVehicles = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vehicles', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setVehicles(json.data);
    } catch { toast.error('Failed to load vehicles'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ type: v.type, make: v.make, model: v.model, registrationNo: v.registrationNo, capacity: v.capacity, ac: v.ac, ratePerKm: v.ratePerKm, ratePerDay: v.ratePerDay || 3000, isActive: v.isActive }); setShowForm(true); };
  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const url = editing ? `/api/admin/vehicles?id=${editing.id}` : '/api/admin/vehicles';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editing ? 'Vehicle updated' : 'Vehicle added');
        setShowForm(false);
        fetchVehicles();
      } else toast.error(json.error.message);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (v: Vehicle) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`/api/admin/vehicles?id=${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !v.isActive }),
    });
    const json = await res.json();
    if (json.success) { toast.success(`Vehicle ${v.isActive ? 'deactivated' : 'activated'}`); fetchVehicles(); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A237E] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">Manage Vehicles</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#FF8F00] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehicles.map(v => (
              <div key={v.id} className={`bg-white rounded-xl shadow-card overflow-hidden ${!v.isActive ? 'opacity-60' : ''}`}>
                <div className="h-24 bg-gradient-to-br from-[#1A237E] to-[#283593] flex items-center justify-center">
                  <span className="text-4xl">{EMOJIS[v.type]}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-[#1A237E] capitalize">{v.type.replace('_', ' ')}</h3>
                      <p className="text-xs text-gray-500">{v.make} {v.model}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-3">{v.registrationNo}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                    <span>👥 {v.capacity} seats</span>
                    <span>❄️ {v.ac ? 'AC' : 'Non-AC'}</span>
                    <span>₹{v.ratePerKm}/km</span>
                    <span>₹{v.ratePerDay}/day</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => toggleActive(v)} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg transition-colors ${v.isActive ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'border border-green-200 text-green-600 hover:bg-green-50'}`}>
                      <Power className="w-3.5 h-3.5" /> {v.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1A237E] mb-5">{editing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Vehicle Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as VehicleType }))} className="input-field">
                  {VEHICLE_TYPES.map(t => <option key={t} value={t}>{VEHICLE_LABELS[t]}</option>)}
                </select>
              </div>
              {[
                { label: 'Make (Manufacturer)', key: 'make', placeholder: 'Toyota, Maruti, etc.' },
                { label: 'Model', key: 'model', placeholder: 'Innova Crysta, Dzire, etc.' },
                { label: 'Registration Number', key: 'registrationNo', placeholder: 'KA01AB1234' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input value={(form as Record<string, unknown>)[key] as string} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="input-field" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: parseInt(e.target.value) }))} className="input-field" min={1} max={50} />
                </div>
                <div>
                  <label className="label">Rate/km (₹)</label>
                  <input type="number" value={form.ratePerKm} onChange={e => setForm(p => ({ ...p, ratePerKm: parseFloat(e.target.value) }))} className="input-field" />
                </div>
                <div>
                  <label className="label">Rate/day (₹)</label>
                  <input type="number" value={form.ratePerDay} onChange={e => setForm(p => ({ ...p, ratePerDay: parseFloat(e.target.value) }))} className="input-field" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="ac" checked={form.ac} onChange={e => setForm(p => ({ ...p, ac: e.target.checked }))} className="w-4 h-4 accent-[#1A237E]" />
                <label htmlFor="ac" className="text-sm text-gray-700 font-medium">Air Conditioned</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary justify-center py-2.5 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? 'Update Vehicle' : 'Add Vehicle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
