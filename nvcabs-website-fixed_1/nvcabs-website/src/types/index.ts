// src/types/index.ts

export type UserRole = 'customer' | 'admin' | 'driver' | 'super_admin';
export type TripType = 'one_way' | 'round_trip' | 'multi_day';
export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type VehicleType = 'sedan' | 'suv' | 'innova' | 'tempo_traveller' | 'mini_bus';
export type EnquiryStatus = 'new' | 'responded' | 'closed';

// ── User ──────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

// ── Vehicle ───────────────────────────────────────────
export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  registrationNo: string;
  capacity: number;
  ac: boolean;
  ratePerKm: number;
  ratePerDay?: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface VehicleOption {
  type: VehicleType;
  label: string;
  description: string;
  capacity: number;
  imageUrl: string;
  features: string[];
  ratePerKm: number;
  baseFare: number;
  icon: string;
}

// ── Route ─────────────────────────────────────────────
export interface Route {
  id: string;
  slug: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationHours: number;
  description?: string;
  highlights: string[];
  imageUrl?: string;
  isFeatured: boolean;
  metaTitle?: string;
  metaDesc?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Tour Package ──────────────────────────────────────
export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  description?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  basePrice: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
}

// ── Driver ────────────────────────────────────────────
export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
  photoUrl?: string;
  user: User;
  vehicle?: Vehicle;
}

// ── Booking ───────────────────────────────────────────
export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  driverId?: string;
  vehicleId?: string;
  tripType: TripType;
  pickupLocation: string;
  pickupLat: number;
  pickupLng: number;
  dropLocation: string;
  dropLat: number;
  dropLng: number;
  pickupDatetime: string;
  returnDatetime?: string;
  passengers: number;
  estimatedDistanceKm?: number;
  estimatedFare?: number;
  finalFare?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  createdAt: string;
  user?: User;
  driver?: Driver;
  vehicle?: Vehicle;
}

// ── Booking Form ──────────────────────────────────────
export interface BookingFormData {
  fullName: string;
  phone: string;
  email?: string;
  pickupLocation: string;
  pickupLat?: number;
  pickupLng?: number;
  dropLocation: string;
  dropLat?: number;
  dropLng?: number;
  tripType: TripType;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  vehicleType: VehicleType;
  passengers: number;
  specialInstructions?: string;
}

// ── Fare Estimate ─────────────────────────────────────
export interface FareEstimate {
  distanceKm: number;
  durationMinutes: number;
  baseFare: number;
  distanceCharge: number;
  driverBatta: number;
  tollEstimate: number;
  nightCharge: number;
  subtotal: number;
  gst: number;
  total: number;
  vehicleType: VehicleType;
  tripType: TripType;
}

export interface FareEstimateRequest {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  vehicleType: VehicleType;
  tripType: TripType;
  pickupDatetime: string;
}

// ── Pricing Rule ──────────────────────────────────────
export interface PricingRule {
  vehicleType: VehicleType;
  tripType: TripType;
  baseFare: number;
  perKmRate: number;
  perHourRate?: number;
  nightSurcharge: number;
  driverBatta: number;
  gstPercent: number;
}

// ── Review ────────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  bookingId?: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  user?: User;
}

// ── Enquiry ───────────────────────────────────────────
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

// ── API Response ──────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// ── Admin Dashboard ───────────────────────────────────
export interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  activeTrips: number;
  pendingEnquiries: number;
  totalBookings: number;
  totalRevenue: number;
  totalDrivers: number;
  totalVehicles: number;
  recentBookings: Booking[];
  bookingsByStatus: Record<BookingStatus, number>;
}

// ── OTP ───────────────────────────────────────────────
export interface OtpRequest {
  phone: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

// ── Auth ──────────────────────────────────────────────
export interface AuthSession {
  user: User;
  token: string;
}

// ── Contact Form ──────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
