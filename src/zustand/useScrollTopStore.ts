'use client';
import { create } from 'zustand';

interface ScrollTopState {
  isAtTop: boolean;
  setIsAtTop: (value: boolean) => void;
}

export const useScrollTopStore = create<ScrollTopState>((set) => ({
  isAtTop: true,
  setIsAtTop: (value) => set({ isAtTop: value }),
}));
