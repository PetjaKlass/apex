'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';
import {
  submitOnboarding,
  INITIAL,
  type OnboardingData,
  type Horizon,
  type FrequencyType,
} from '@/lib/submitOnboarding';

type Step = 'welcome' | 'identity' | 'workspace' | 'vision' | 'goal' | 'habit' | 'obt' | 'complete';
const ORDER: Step[] = ['identity', 'workspace', 'vision', 'goal', 'habit', 'obt'];

const IDENTITIES: [string, string, string][] = [
  ['founder', 'Der Solo-Founder', 'Baut allein ein Unternehmen, setzt auf sich selbst.'],
  ['operator', 'Der Operator', 'Ergebnisgetrieben, allergisch gegen Beschäftigungstherapie.'],
  ['creator', 'Der Creator', 'Bringt Arbeit in die Welt, zu eigenen Bedingungen.'],
  ['athlete', 'Der Selbst-Athlet', 'Trainiert Körper und Geist wie ein Handwerk.'],
  ['builder', 'Der stille Macher', 'Verzinst sich in der Stille, Ergebnisse sprechen.'],
];
const ACCENTS: [string, string][] = [
  ['gold', '#C9993A'],
  ['silver', '#8B9AAB'],
  ['rose', '#C4707A'],
  ['sapphire', '#4A7FA5'],
  ['emerald', '#3A7D58'],
];

function Scaffold({
  eyebrow,
  title,
  subtitle,
  step,
  onBack,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  step?: Step;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const num = step ? ORDER.indexOf(step) + 1 : 0;
  return (
    <div className="ob">
      <div className="ob-left">
        <div className="ob-glow" aria-hidden="true" />
        <div className="ob-brand">
          <div className="brand-mark">
            <Icon id="i-peak" s={17} />
          </div>
          <span>APEX</span>
        </div>
        <div className="ob-mid">
          {eyebrow && <div className="ob-eyebrow">{eyebrow}</div>}
          <h1 className="ob-title">{title}</h1>
          {subtitle && <p className="ob-sub">{subtitle}</p>}
        </div>
        {num > 0 ? (
          <div className="ob-prog">
            <div className="ob-track">
              <div className="ob-fill" style={{ width: `${(num / 6) * 100}%` }} />
            </div>
            <span className="mono">{num}/6</span>
          </div>
        ) : (
          <div style={{ height: 4 }} />
        )}
      </div>
      <div className="ob-right">
        <div className="ob-col">
          {onBack && (
            <button className="ob-back" onClick={onBack}>
              ‹ Zurück
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function Onboarding({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [d, setD] = useState<OnboardingData>(INITIAL);
  const [accent, setAccentState] = useState('gold');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) =>
    setD((p) => ({ ...p, [k]: v }));
  const back = () => {
    const i = ORDER.indexOf(step);
    setStep(i > 0 ? (ORDER[i - 1] ?? 'welcome') : 'welcome');
  };
  const pickAccent = (a: string) => {
    setAccentState(a);
    document.documentElement.setAttribute('data-accent', a);
  };

  const finish = async () => {
    setBusy(true);
    setErr('');
    try {
      const { data: ws } = await supabase
        .from('workspaces')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);
      const wsId = ws?.[0]?.id;
      if (!wsId) throw new Error('Kein Workspace gefunden.');
      await submitOnboarding(d, userId, wsId);
      setStep('complete');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Fehler beim Speichern.');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'welcome')
    return (
      <Scaffold
        title="Du bist nicht hier, um Aufgaben zu verwalten."
        subtitle="Apex verbindet, was du heute tust, mit dem Menschen, der du wirst. Fünf Minuten jetzt setzen den Rahmen."
      >
        <label className="ob-check">
          <input
            type="checkbox"
            checked={d.consent}
            onChange={(e) => set('consent', e.target.checked)}
          />
          <span>Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung.</span>
        </label>
        <div className="ob-actions">
          <button
            className="btn btn-primary"
            disabled={!d.consent}
            onClick={() => setStep('identity')}
          >
            Beginnen
          </button>
        </div>
      </Scaffold>
    );

  if (step === 'identity') {
    const isCustom = d.identity !== null && !IDENTITIES.some(([k]) => k === d.identity);
    return (
      <Scaffold
        eyebrow="Identität"
        title="Wer wirst du gerade?"
        subtitle="Das prägt, wie Apex mit dir spricht. Eine Wahl — jederzeit änderbar."
        step="identity"
        onBack={back}
      >
        {IDENTITIES.map(([k, label, desc]) => (
          <button
            key={k}
            className={`ob-card${d.identity === k ? 'sel' : ''}`}
            onClick={() => set('identity', k)}
          >
            <div className="t">{label}</div>
            <div className="d">{desc}</div>
          </button>
        ))}
        <div className="ob-label">…oder in deinen eigenen Worten</div>
        <input
          className="auth-input"
          value={isCustom ? (d.identity ?? '') : ''}
          onChange={(e) => set('identity', e.target.value || null)}
          placeholder="…"
        />
        <div className="ob-actions">
          <button
            className="btn btn-primary"
            disabled={!d.identity}
            onClick={() => setStep('workspace')}
          >
            Weiter
          </button>
          <button className="ob-skip" onClick={() => setStep('workspace')}>
            Vorerst überspringen
          </button>
        </div>
      </Scaffold>
    );
  }

  if (step === 'workspace')
    return (
      <Scaffold
        eyebrow="Workspace"
        title="Benenne deinen Raum."
        subtitle="Und wähle die Farbe, in der du leben willst."
        step="workspace"
        onBack={back}
      >
        <div className="ob-label" style={{ marginTop: 0 }}>
          Workspace-Name
        </div>
        <input
          className="auth-input"
          value={d.workspaceName}
          onChange={(e) => set('workspaceName', e.target.value)}
          placeholder="Personal"
        />
        <div className="ob-label">Allein oder zu zweit</div>
        <div className="ob-seg">
          <button
            className={d.workspaceType === 'solo' ? 'on' : ''}
            onClick={() => set('workspaceType', 'solo')}
          >
            Solo
          </button>
          <button
            className={d.workspaceType === 'duo' ? 'on' : ''}
            onClick={() => set('workspaceType', 'duo')}
          >
            Duo
          </button>
        </div>
        <div className="ob-label">Akzent</div>
        <div className="ob-dots">
          {ACCENTS.map(([k, hex]) => (
            <button
              key={k}
              className={`ob-dot${accent === k ? 'on' : ''}`}
              onClick={() => pickAccent(k)}
              aria-label={k}
            >
              <i style={{ background: hex }} />
            </button>
          ))}
        </div>
        <div className="ob-actions">
          <button
            className="btn btn-primary"
            disabled={!d.workspaceName.trim()}
            onClick={() => setStep('vision')}
          >
            Weiter
          </button>
        </div>
      </Scaffold>
    );

  if (step === 'vision')
    return (
      <Scaffold
        eyebrow="Vision"
        title="Wohin führt das alles?"
        subtitle="Kein Ziel — der Horizont, auf den Ziele zeigen. Überspringe, wenn es noch nicht bereit ist."
        step="vision"
        onBack={back}
      >
        <div className="ob-label" style={{ marginTop: 0 }}>
          Vision in einer Zeile
        </div>
        <input
          className="auth-input"
          value={d.visionTitle}
          onChange={(e) => set('visionTitle', e.target.value)}
          placeholder="z. B. Ein ruhiges, profitables Unternehmen, auf das ich stolz bin"
        />
        <div className="ob-label">Zukunfts-Ich-Satz (optional)</div>
        <textarea
          className="ob-textarea"
          maxLength={280}
          value={d.visionStatement}
          onChange={(e) => set('visionStatement', e.target.value)}
          placeholder="In drei Jahren bin ich jemand, der…"
        />
        <div className="ob-label">Horizont</div>
        <div className="ob-seg">
          {(['1y', '3y', '5y'] as Horizon[]).map((h) => (
            <button
              key={h}
              className={d.visionHorizon === h ? 'on' : ''}
              onClick={() => set('visionHorizon', h)}
            >
              {h === '1y' ? '1 Jahr' : h === '3y' ? '3 Jahre' : '5 Jahre'}
            </button>
          ))}
        </div>
        <div className="ob-actions">
          <button className="btn btn-primary" onClick={() => setStep('goal')}>
            Weiter
          </button>
          <button className="ob-skip" onClick={() => setStep('goal')}>
            Vorerst überspringen
          </button>
        </div>
      </Scaffold>
    );

  if (step === 'goal')
    return (
      <Scaffold
        eyebrow="Ziel"
        title="Was ist der erste Zug?"
        subtitle="Ein 90-Tage-Ziel, das die Vision näher rückt."
        step="goal"
        onBack={back}
      >
        <div className="ob-label" style={{ marginTop: 0 }}>
          Ziel dieses Quartal
        </div>
        <input
          className="auth-input"
          value={d.goalTitle}
          onChange={(e) => set('goalTitle', e.target.value)}
          placeholder="z. B. Apex-Alpha ausliefern und täglich nutzen"
        />
        <div className="ob-label">Woran misst du es? (optional)</div>
        <input
          className="auth-input"
          value={d.keyResult}
          onChange={(e) => set('keyResult', e.target.value)}
          placeholder="z. B. 30 Tage am Stück genutzt"
        />
        <div className="ob-actions">
          <button className="btn btn-primary" onClick={() => setStep('habit')}>
            Weiter
          </button>
          <button className="ob-skip" onClick={() => setStep('habit')}>
            Vorerst überspringen
          </button>
        </div>
      </Scaffold>
    );

  if (step === 'habit')
    return (
      <Scaffold
        eyebrow="Gewohnheit"
        title="Wer wirst du täglich?"
        subtitle="Eine Gewohnheit ist Identität in Bewegung. Beginne mit einer."
        step="habit"
        onBack={back}
      >
        <div className="ob-label" style={{ marginTop: 0 }}>
          Gewohnheit
        </div>
        <input
          className="auth-input"
          value={d.habitTitle}
          onChange={(e) => set('habitTitle', e.target.value)}
          placeholder="z. B. 20 Seiten lesen"
        />
        <div className="ob-label">Identitätssatz</div>
        <input
          className="auth-input"
          value={d.habitIdentity}
          onChange={(e) => set('habitIdentity', e.target.value)}
          placeholder="Ich bin jemand, der jeden Tag lernt"
        />
        <div className="ob-label">Häufigkeit</div>
        <div className="ob-seg">
          {(['daily', 'x_per_week', 'weekly'] as FrequencyType[]).map((f) => (
            <button
              key={f}
              className={d.habitFrequency === f ? 'on' : ''}
              onClick={() => set('habitFrequency', f)}
            >
              {f === 'daily' ? 'Täglich' : f === 'x_per_week' ? 'Mehrmals' : 'Wöchentlich'}
            </button>
          ))}
        </div>
        <div className="ob-actions">
          <button className="btn btn-primary" onClick={() => setStep('obt')}>
            Weiter
          </button>
          <button className="ob-skip" onClick={() => setStep('obt')}>
            Vorerst überspringen
          </button>
        </div>
      </Scaffold>
    );

  if (step === 'obt')
    return (
      <Scaffold
        eyebrow="One Big Thing"
        title="Was ist heute das Eine?"
        subtitle="Nicht deine Liste. Das eine, das heute am meisten zählt."
        step="obt"
        onBack={back}
      >
        <div className="ob-label" style={{ marginTop: 0 }}>
          Das One Big Thing für heute
        </div>
        <input
          className="auth-input"
          value={d.obtTitle}
          onChange={(e) => set('obtTitle', e.target.value)}
          placeholder="z. B. Den Onboarding-Flow fertigstellen"
        />
        {err && <p className="auth-err">{err}</p>}
        <div className="ob-actions">
          <button className="btn btn-primary" disabled={busy} onClick={finish}>
            {busy ? 'Speichern…' : 'Apex einrichten'}
          </button>
        </div>
      </Scaffold>
    );

  return (
    <Scaffold
      title="Der Rahmen steht."
      subtitle="Vision, Ziel, Gewohnheit, der heutige Fokus — alles an seinem Platz. Jetzt bleibt nur noch die tägliche Frage."
    >
      <div className="ob-actions">
        <button className="btn btn-primary" onClick={onDone}>
          Apex betreten
        </button>
      </div>
    </Scaffold>
  );
}
