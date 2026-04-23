// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'nvcabs-auth' }
  )
);

interface BookingState {
  pickupLocation: string;
  dropLocation: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  setPickup: (location: string, lat?: number, lng?: number) => void;
  setDrop: (location: string, lat?: number, lng?: number) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  pickupLocation: '',
  dropLocation: '',
  pickupLat: 12.9716,
  pickupLng: 77.5946,
  dropLat: 0,
  dropLng: 0,
  setPickup: (location, lat = 12.9716, lng = 77.5946) => set({ pickupLocation: location, pickupLat: lat, pickupLng: lng }),
  setDrop: (location, lat = 0, lng = 0) => set({ dropLocation: location, dropLat: lat, dropLng: lng }),
  reset: () => set({ pickupLocation: '', dropLocation: '', pickupLat: 12.9716, pickupLng: 77.5946, dropLat: 0, dropLng: 0 }),
}));
