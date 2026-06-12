import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatNumber } from './format';
import { translate } from './translate';
import de from '../messages/de.json';
import en from '../messages/en.json';

function keysOf(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

describe('Message-Bundles', () => {
  it('EN und DE haben identische Key-Struktur', () => {
    expect(keysOf(de).sort()).toEqual(keysOf(en).sort());
  });
  it('Umlaute überleben (ä ö ü ß)', () => {
    expect(translate('de', 'common.delete')).toBe('Löschen');
    expect(translate('de', 'common.close')).toBe('Schließen');
  });
});

describe('translate()', () => {
  it('interpoliert Variablen', () => {
    expect(translate('de', 'greeting.morning', { name: 'Petja' })).toBe('Guten Morgen, Petja.');
  });
  it('Plurale: =0 / one / other', () => {
    expect(translate('en', 'tasks.count', { count: 0 })).toBe('No tasks');
    expect(translate('en', 'tasks.count', { count: 1 })).toBe('1 task');
    expect(translate('en', 'tasks.count', { count: 4 })).toBe('4 tasks');
    expect(translate('de', 'tasks.count', { count: 0 })).toBe('Keine Aufgaben');
    expect(translate('de', 'tasks.count', { count: 1 })).toBe('1 Aufgabe');
    expect(translate('de', 'tasks.count', { count: 4 })).toBe('4 Aufgaben');
  });
  it('fällt auf EN zurück, dann auf den Key', () => {
    expect(translate('de', 'gibt.es.nicht')).toBe('gibt.es.nicht');
  });
});

describe('Intl-Formate', () => {
  const d = new Date('2026-03-15T12:00:00Z');
  it('Datum', () => {
    expect(formatDate(d, 'en')).toBe('Mar 15');
    expect(formatDate(d, 'de')).toBe('15. März');
  });
  it('Zahl', () => {
    expect(formatNumber(1234.56, 'en')).toBe('1,234.56');
    expect(formatNumber(1234.56, 'de')).toBe('1.234,56');
  });
  it('Währung', () => {
    expect(formatCurrency(12, 'en', 'USD')).toBe('$12.00');
    // Intl nutzt geschützte Leerzeichen (U+00A0/U+202F) vor dem Symbol — normalisieren:
    expect(formatCurrency(12, 'de').replace(/[\u00A0\u202F]/g, ' ')).toBe('12,00 €');
  });
});
