'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr(error.message);
    // Erfolg → onAuthStateChange im AppGate übernimmt den Wechsel
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card card" onSubmit={submit}>
        <div className="brand">
          <div className="brand-mark">
            <Icon id="i-peak" s={17} />
          </div>
          <span className="brand-name">APEX</span>
        </div>
        <h1 className="auth-h1">Willkommen zurück.</h1>
        <label className="auth-label" htmlFor="email">
          E-Mail
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="du@beispiel.de"
        />
        <label className="auth-label" htmlFor="pw">
          Passwort
        </label>
        <input
          id="pw"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="auth-err">{err}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Anmelden…' : 'Anmelden'}
        </button>
      </form>
    </div>
  );
}
