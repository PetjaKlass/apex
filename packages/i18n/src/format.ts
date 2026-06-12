/** Intl-Helper — Locale-bewusste Formate (design-system §19: deutsche Formate sind Pflicht). */
import type { Locale } from './index';

const BCP47: Record<Locale, string> = { en: 'en-US', de: 'de-DE' };

export function formatDate(
  date: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
): string {
  return new Intl.DateTimeFormat(BCP47[locale], options).format(date);
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(BCP47[locale], options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = 'EUR'): string {
  return new Intl.NumberFormat(BCP47[locale], { style: 'currency', currency }).format(value);
}
