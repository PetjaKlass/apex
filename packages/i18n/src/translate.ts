/**
 * Leichtgewichtiger Übersetzer für die PRODUCT-App (Marketing nutzt next-intl mit voller ICU).
 * Unterstützt bewusst NUR: verschachtelte Keys ("nav.tasks"), {var}-Interpolation und
 * einfache Plurale {count, plural, =0 {…} one {…} other {…}} mit #-Ersetzung.
 * Mehr ICU (select, Verschachtelung) ist Out-of-Scope (Phase-03-Spec).
 */
import { messages, type Locale, type Messages } from './index';

type Values = Record<string, string | number>;

function resolveKey(obj: Messages, key: string): string | undefined {
  let cur: unknown = obj;
  for (const part of key.split('.')) {
    if (typeof cur !== 'object' || cur === null) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

const PLURAL_RE = /\{(\w+),\s*plural\s*,([^]*)\}/;

function applyPlural(template: string, values: Values, locale: Locale): string {
  const m = template.match(PLURAL_RE);
  if (!m || m[1] === undefined || m[2] === undefined) return template;
  const count = Number(values[m[1]] ?? 0);
  const branches: Record<string, string> = {};
  const branchRe = /(=\d+|one|other)\s*\{([^{}]*)\}/g;
  for (const b of m[2].matchAll(branchRe)) {
    if (b[1] !== undefined && b[2] !== undefined) branches[b[1]] = b[2];
  }
  const exact = branches[`=${count}`];
  const plural =
    exact ??
    (new Intl.PluralRules(locale).select(count) === 'one'
      ? (branches['one'] ?? branches['other'])
      : branches['other']);
  return template.replace(PLURAL_RE, (plural ?? '').replaceAll('#', String(count)));
}

export function translate(locale: Locale, key: string, values: Values = {}): string {
  let template = resolveKey(messages[locale], key);
  if (template === undefined) {
    if (locale !== 'en') template = resolveKey(messages.en, key); // Fallback EN
    if (template === undefined) return key; // letzter Fallback: Key sichtbar lassen
  }
  let out = applyPlural(template, values, locale);
  for (const [k, v] of Object.entries(values)) {
    out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}
