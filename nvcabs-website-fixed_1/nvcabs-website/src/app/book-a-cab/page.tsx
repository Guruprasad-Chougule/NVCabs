'use client';
// src/app/book-a-cab/page.tsx
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, MapPin, Calendar, Users, Car, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { formatCurrency, VEHICLE_LABELS, VEHICLE_CAPACITY } from '@/lib/utils';
import { FareEstimate, VehicleType } from '@/types';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  pickupLocation: z.string().min(3, 'Enter pickup location'),
  dropLocation: z.string().min(3, 'Enter drop location'),
  tripType: z.enum(['one_way', 'round_trip', 'multi_day']),
  pickupDate: z.string().min(1, 'Select pickup date'),
  pickupTime: z.string().min(1, 'Select pickup time'),
  returnDate: z.string().optional(),
  vehicleType: z.enum(['sedan', 'suv', 'innova', 'tempo_traveller', 'mini_bus']),
  passengers: z.coerce.number().int().min(1).max(40),
  specialInstructions: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

const TRIP_TYPES = [
  { value: 'one_way', label: 'One Way' },
  { value: 'round_trip', label: 'Round Trip' },
  { value: 'multi_day', label: 'Multi Day' },
];

const VEHICLE_OPTIONS: { value: VehicleType; emoji: string }[] = [
  { value: 'sedan', emoji: '🚗' },
  { value: 'suv', emoji: '🚙' },
  { value: 'innova', emoji: '🚐' },
  { value: 'tempo_traveller', emoji: '🚌' },
  { value: 'mini_bus', emoji: '🚍' },
];

function BookACabForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'form' | 'otp' | 'confirm' | 'success'>('form');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fare, setFare] = useState<FareEstimate | null>(null);
  const [allFares, setAllFares] = useState<FareEstimate[]>([]);
  const [fareLoading, setFareLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ bookingRef: string; estimatedFare?: number } | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripType: 'one_way',
      vehicleType: (searchParams.get('vehicle') as VehicleType) || 'sedan',
      passengers: 1,
      pickupLocation: searchParams.get('pickup') || '',
      dropLocation: searchParams.get('drop') || '',
      pickupDate: searchParams.get('date') || '',
    },
  });

  const tripType = watch('tripType');
  const vehicleType = watch('vehicleType');
  const phone = watch('phone');

  // Mock coordinates (real app uses Google Places)
  const MOCK_COORDS: Record<string, [number, number]> = {
    default: [12.9716, 77.5946],
    ooty: [11.4102, 76.6950],
    coorg: [12.3375, 75.8069],
    mysore: [12.2958, 76.6394],
    airport: [13.1986, 77.7066],
  };

  const estimateFare = async (data: Partial<FormData>) => {
    if (!data.pickupLocation || !data.dropLocation || !data.pickupDate || !data.tripType) return;
    setFareLoading(true);
    try {
      const pickupCoords = MOCK_COORDS.default;
      const dropKey = (data.dropLocation || '').toLowerCase();
      const dropCoords = Object.entries(MOCK_COORDS).find(([k]) => dropKey.includes(k))?.[1] || [11.4102, 76.6950];

      const res = await fetch('/api/fare-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: pickupCoords[0], pickupLng: pickupCoords[1],
          dropLat: dropCoords[0], dropLng: dropCoords[1],
          vehicleType: data.vehicleType || 'sedan',
          tripType: data.tripType || 'one_way',
          pickupDatetime: `${data.pickupDate}T${data.pickupTime || '08:00'}`,
          allVehicles: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAllFares(json.data);
        const selected = json.data.find((f: FareEstimate) => f.vehicleType === (data.vehicleType || 'sedan'));
        if (selected) setFare(selected);
      }
    } catch {
      // silent
    } finally {
      setFareLoading(false);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const sub = watch((val, { name }) => {
      if (['pickupLocation', 'dropLocation', 'pickupDate', 'pickupTime', 'tripType', 'vehicleType'].includes(name || '')) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => estimateFare(val as FormData), 800);
      }
    });
    return () => {
      if (timer) clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [watch]);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Enter a valid 10-digit mobile number first');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (json.success) {
        setOtpSent(true);
        toast.success(`OTP sent to ${phone.slice(0, 5)}*****`);
        if (json.data.mockOtp) toast(`(Dev mode) OTP: ${json.data.mockOtp}`, { icon: '🔑' });
      } else {
        toast.error(json.error.message);
      }
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async (formData: FormData) => {
    if (!otp || otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setSubmitLoading(true);
    try {
      // Verify OTP
      const otpRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp, name: formData.fullName }),
      });
      const otpJson = await otpRes.json();
      if (!otpJson.success) { toast.error(otpJson.error.message); return; }

      // Create booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedFare: fare?.total,
          estimatedDistanceKm: fare?.distanceKm,
          pickupLat: MOCK_COORDS.default[0],
          pickupLng: MOCK_COORDS.default[1],
          dropLat: 11.4102,
          dropLng: 76.6950,
        }),
      });
      const bookingJson = await bookingRes.json();
      if (bookingJson.success) {
        setBookingResult(bookingJson.data);
        setStep('success');
        toast.success('Booking confirmed! 🎉');
      } else {
        toast.error(bookingJson.error.message);
      }
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!otpSent) { toast.error('Please verify your mobile number first'); return; }
    await verifyOtp(data);
  };

  if (step === 'success' && bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#1A237E] mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">Your cab has been booked successfully. You will receive a confirmation SMS shortly.</p>
          <div className="bg-[#1A237E]/5 rounded-xl p-6 mb-6">
            <p className="text-gray-500 text-sm mb-1">Booking Reference</p>
            <p className="text-3xl font-bold text-[#FF6F00]">{bookingResult.bookingRef}</p>
            {bookingResult.estimatedFare && (
              <p className="text-gray-600 mt-3">
                Estimated Fare: <span className="font-bold text-[#1A237E]">{formatCurrency(bookingResult.estimatedFare)}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">Save this reference number to track your booking. Our team will contact you within 30 minutes to confirm driver details.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/" className="btn-primary">Back to Home</a>
            <a href="tel:9530800800" className="btn-secondary"><Phone className="w-4 h-4" /> Call Support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1A237E] mb-3">Book a Cab</h1>
          <p className="text-gray-600">Fill in your trip details and get an instant fare estimate.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-6">

              {/* Personal Info */}
              <div>
                <h2 className="text-lg font-bold text-[#1A237E] mb-4 pb-2 border-b border-gray-100">Personal Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input {...register('fullName')} placeholder="Your name" className="input-field" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Mobile Number *</label>
                    <div className="flex gap-2">
                      <input {...register('phone')} placeholder="10-digit mobile" className="input-field flex-1" maxLength={10} />
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpLoading || otpSent}
                        className={`px-4 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${otpSent ? 'bg-green-500 text-white' : 'bg-[#1A237E] text-white hover:bg-[#283593]'} disabled:opacity-60`}
                      >
                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? '✓ Sent' : 'Send OTP'}
                      </button>
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  {otpSent && (
                    <div className="sm:col-span-2">
                      <label className="label">Enter OTP *</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit OTP"
                          className="input-field w-48"
                          maxLength={6}
                        />
                        {otp.length === 6 && <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Ready</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">OTP sent to your mobile. Valid for 10 minutes.</p>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="label">Email Address (Optional)</label>
                    <input {...register('email')} type="email" placeholder="your@email.com" className="input-field" />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h2 className="text-lg font-bold text-[#1A237E] mb-4 pb-2 border-b border-gray-100">Trip Details</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label"><MapPin className="w-3.5 h-3.5 inline mr-1 text-[#1A237E]" />Pickup Location *</label>
                      <input {...register('pickupLocation')} placeholder="e.g. Koramangala, Bangalore" className="input-field" />
                      {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>}
                    </div>
                    <div>
                      <label className="label"><MapPin className="w-3.5 h-3.5 inline mr-1 text-[#FF6F00]" />Drop Location *</label>
                      <input {...register('dropLocation')} placeholder="e.g. Ooty, Tamil Nadu" className="input-field" />
                      {errors.dropLocation && <p className="text-red-500 text-xs mt-1">{errors.dropLocation.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label">Trip Type *</label>
                    <div className="flex gap-3 flex-wrap">
                      {TRIP_TYPES.map(t => (
                        <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                          <input {...register('tripType')} type="radio" value={t.value} className="accent-[#1A237E]" />
                          <span className="text-sm font-medium text-gray-700">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="label"><Calendar className="w-3.5 h-3.5 inline mr-1" />Pickup Date *</label>
                      <input {...register('pickupDate')} type="date" min={new Date().toISOString().split('T')[0]} className="input-field" />
                      {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate.message}</p>}
                    </div>
                    <div>
                      <label className="label">Pickup Time *</label>
                      <input {...register('pickupTime')} type="time" className="input-field" />
                      {errors.pickupTime && <p className="text-red-500 text-xs mt-1">{errors.pickupTime.message}</p>}
                    </div>
                    {tripType !== 'one_way' && (
                      <div>
                        <label className="label">Return Date</label>
                        <input {...register('returnDate')} type="date" className="input-field" />
                      </div>
                    )}
                    <div>
                      <label className="label"><Users className="w-3.5 h-3.5 inline mr-1" />Passengers *</label>
                      <input {...register('passengers')} type="number" min={1} max={40} className="input-field" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <h2 className="text-lg font-bold text-[#1A237E] mb-4 pb-2 border-b border-gray-100">Select Vehicle</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {VEHICLE_OPTIONS.map(v => {
                    const fareForVehicle = allFares.find(f => f.vehicleType === v.value);
                    return (
                      <label
                        key={v.value}
                        className={`relative flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          vehicleType === v.value
                            ? 'border-[#1A237E] bg-[#1A237E]/5'
                            : 'border-gray-200 hover:border-[#1A237E]/40'
                        }`}
                      >
                        <input {...register('vehicleType')} type="radio" value={v.value} className="sr-only" />
                        <span className="text-3xl mb-1">{v.emoji}</span>
                        <span className="text-xs font-semibold text-gray-700 text-center">{VEHICLE_LABELS[v.value].split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-400">{VEHICLE_CAPACITY[v.value]} seats</span>
                        {fareForVehicle && (
                          <span className="text-[11px] text-[#FF6F00] font-bold mt-1">{formatCurrency(fareForVehicle.total)}</span>
                        )}
                        {vehicleType === v.value && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#1A237E] rounded-full flex items-center justify-center">
                            <span className="text-white text-[8px]">✓</span>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="label">Special Instructions (Optional)</label>
                <textarea
                  {...register('specialInstructions')}
                  rows={3}
                  placeholder="Any special requirements, preferred stops, or notes for the driver..."
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading || !otpSent}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <>Confirm Booking <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              {!otpSent && (
                <p className="text-center text-sm text-gray-500">Please verify your mobile number to confirm booking</p>
              )}
            </form>
          </div>

          {/* Fare Summary Sidebar */}
          <div className="space-y-4">
            {/* Fare card */}
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-bold text-[#1A237E] mb-4 text-lg">Fare Estimate</h3>
              {fareLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-5 bg-gray-200 rounded" />)}
                </div>
              ) : fare ? (
                <>
                  <div className="space-y-2.5 text-sm mb-4">
                    {[
                      ['Distance', `~${fare.distanceKm} km`],
                      ['Duration', `~${Math.round(fare.durationMinutes / 60)}h ${fare.durationMinutes % 60}m`],
                      ['Base Fare', formatCurrency(fare.baseFare)],
                      ['Distance Charge', formatCurrency(fare.distanceCharge)],
                      ...(fare.driverBatta > 0 ? [['Driver Batta', formatCurrency(fare.driverBatta)]] : []),
                      ['Toll Estimate', formatCurrency(fare.tollEstimate)],
                      ...(fare.nightCharge > 0 ? [['Night Charge', formatCurrency(fare.nightCharge)]] : []),
                      ['GST (5%)', formatCurrency(fare.gst)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-gray-600">
                        <span>{label}</span><span>{value}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2.5 flex justify-between font-bold text-[#1A237E] text-base">
                      <span>Total Estimate</span>
                      <span className="text-[#FF6F00]">{formatCurrency(fare.total)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">* Final fare may vary slightly based on actual distance and tolls.</p>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Enter trip details to see fare estimate</p>
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="bg-[#1A237E]/5 rounded-xl p-5">
              <h4 className="font-semibold text-[#1A237E] mb-3">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">Our team is available 24/7 to assist with your booking.</p>
              <a href="tel:9530800800" className="btn-primary text-sm w-full justify-center">
                <Phone className="w-4 h-4" /> Call 9530800800
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookACabPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
        </div>
      }
    >
      <BookACabForm />
    </Suspense>
  );
}
