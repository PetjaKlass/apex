import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('löst Tailwind-Konflikte (letzte gewinnt)', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('bg-card', false && 'bg-subtle', 'text-fg-1')).toBe('bg-card text-fg-1');
  });
});
