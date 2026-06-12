import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { GoldThread } from '@/components/site';

/** Auth-Hülle — Formulare werden in Phase 08 mit Supabase verdrahtet. */
export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = useTranslations('marketing.auth');
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-3">
          <GoldThread className="h-6" />
          <span className="font-display text-fg-1 text-base font-bold tracking-tight">APEX</span>
        </Link>
        <h1 className="font-display text-fg-1 mt-10 text-2xl font-bold tracking-tight">{title}</h1>
        <div className="bg-card shadow-card-edge dark:border-border mt-8 rounded-xl p-6 dark:border">
          {children}
          <p className="bg-subtle text-fg-3 shadow-edge mt-4 rounded-sm px-3 py-2 text-xs">
            {t('comingSoon')}
          </p>
        </div>
        {footer && <div className="text-fg-2 mt-6 text-center text-sm">{footer}</div>}
      </div>
    </main>
  );
}

export function Field({
  label,
  type,
  autoComplete,
}: {
  label: string;
  type: string;
  autoComplete: string;
}) {
  const id = `auth-${type}-${label}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-2xs text-fg-2 mb-1.5 block font-semibold">{label}</span>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        disabled
        className="border-border bg-subtle text-fg-1 shadow-edge focus-visible:border-accent h-[42px] w-full rounded border px-4 text-sm outline-none disabled:opacity-60"
      />
    </label>
  );
}

export function SubmitButton({ label }: { label: string }) {
  return (
    <button
      disabled
      className="bg-accent text-accent-on shadow-card-edge mt-2 w-full rounded-full px-6 py-3 text-sm font-semibold opacity-60"
    >
      {label}
    </button>
  );
}
