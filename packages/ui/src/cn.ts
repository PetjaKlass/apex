import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Klassen zusammenführen mit Tailwind-Konfliktauflösung (letzte gewinnt). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
