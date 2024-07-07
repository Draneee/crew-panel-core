import { VariantsType } from '@/types/const_types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const CALOTG_COLORS: Record<string, VariantsType> = {
  LOADING: 'stuff',
  FINAL: 'destructive',
  DEFAULT: 'pending',
};
export const selectColorStatus = (step: string) =>
  CALOTG_COLORS[step] ?? CALOTG_COLORS['DEFAULT'];
