// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VehicleType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Format currency in Indian Rupees ──────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Format date ───────────────────────────────────────
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// ── Format datetime ───────────────────────────────────
export function formatDateTime(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// ── Generate booking reference ────────────────────────
export function generateBookingRef(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `NV-${year}${month}${day}-${random}`;
}

// ── Generate OTP ──────────────────────────────────────
export function generateOTP(): string {
  if (process.env.MOCK_OTP_ENABLED === 'true') {
    return process.env.MOCK_OTP_VALUE || '123456';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Validate Indian phone number ──────────────────────
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

// ── Calculate distance between two coordinates (Haversine) ───
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

// ── Vehicle label mapping ─────────────────────────────
export const VEHICLE_LABELS: Record<VehicleType, string> = {
  sedan: 'Sedan (Dzire/Etios)',
  suv: 'SUV (Fortuner/Scorpio)',
  innova: 'Toyota Innova Crysta',
  tempo_traveller: 'Tempo Traveller (12-14 Seater)',
  mini_bus: 'Mini Bus (20-22 Seater)',
};

export const VEHICLE_CAPACITY: Record<VehicleType, number> = {
  sedan: 4,
  suv: 6,
  innova: 7,
  tempo_traveller: 14,
  mini_bus: 22,
};

// ── Booking status color ──────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// ── Slug to title ─────────────────────────────────────
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ── Truncate text ─────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// ── Is night time (for surcharge) ────────────────────
export function isNightTime(dateTime: string | Date): boolean {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  const hours = date.getHours();
  return hours >= 22 || hours < 6;
}

// ── WhatsApp link ─────────────────────────────────────
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/91${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

// ── Phone link ────────────────────────────────────────
export function getPhoneLink(phone: string): string {
  return `tel:+91${phone.replace(/\D/g, '')}`;
}

// ── Debounce ──────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
