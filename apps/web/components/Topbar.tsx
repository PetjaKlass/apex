'use client';
import { useState } from 'react';
import { Icon } from './Icon';

const ACCENTS: [string, string, string][] = [
  ['gold', '#C9993A', 'Gold'],
  ['silver', '#8B9AAB', 'Silber'],
  ['rose', '#C4707A', 'Rosé'],
  ['sapphire', '#4A7FA5', 'Saphir'],
  ['emerald', '#3A7D58', 'Smaragd'],
];

export function Topbar({ title = 'Dashboard' }: { title?: string }) {
  const [accent, setAccent] = useState('gold');

  const pickAccent = (a: string) => {
    setAccent(a);
    document.documentElement.setAttribute('data-accent', a);
  };
  const toggleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <button className="search" aria-label="Suche öffnen">
        <Icon id="i-search" s={14} />
        Suchen oder Befehl…
        <kbd>⌘K</kbd>
      </button>
      <button className="chip sync-chip" title="Sync-Status">
        <span className="sync-dot"></span>Synchron
      </button>
      <div className="accent-dots" role="group" aria-label="Akzentfarbe">
        {ACCENTS.map(([key, hex, label]) => (
          <button
            key={key}
            className="accent-dot"
            style={{ background: hex }}
            aria-pressed={accent === key}
            aria-label={label}
            onClick={() => pickAccent(key)}
          />
        ))}
      </div>
      <button className="icon-btn" aria-label="Theme wechseln" onClick={toggleTheme}>
        <Icon id="i-moon" s={16} />
      </button>
      <button className="icon-btn" aria-label="Benachrichtigungen">
        <Icon id="i-bell" s={16} />
      </button>
      <div className="avatar" aria-hidden="true">
        PK
      </div>
    </header>
  );
}
