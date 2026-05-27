import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional classes (clsx) and resolves Tailwind conflicts (twMerge).
 * Standard utility for variant-driven NativeWind components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
