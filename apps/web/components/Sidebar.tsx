import { Icon } from './Icon';

const NAV = [
  { key: 'dashboard', icon: 'i-dash', label: 'Dashboard', badge: undefined as string | undefined },
  { key: 'tasks', icon: 'i-check-sq', label: 'Aufgaben', badge: '4' },
  { key: 'habits', icon: 'i-repeat', label: 'Gewohnheiten' },
  { key: 'focus', icon: 'i-timer', label: 'Fokus' },
  { section: 'Richtung' },
  { key: 'goals', icon: 'i-target', label: 'Ziele', soon: true },
  { key: 'vision', icon: 'i-scope', label: 'Vision', soon: true },
  { section: 'Reflexion' },
  { key: 'journal', icon: 'i-pen', label: 'Journal', soon: true },
  { key: 'knowledge', icon: 'i-book', label: 'Wissen', soon: true },
  { section: 'Referenz' },
  { key: 'system', icon: 'i-grid', label: 'Designsystem' },
] as const;

export function Sidebar({
  active = 'dashboard',
  onSignOut,
}: {
  active?: string;
  onSignOut?: () => void;
}) {
  return (
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="traffic" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="brand">
        <div className="brand-mark">
          <Icon id="i-peak" s={17} />
        </div>
        <span className="brand-name">APEX</span>
      </div>
      {NAV.map((n, i) =>
        'section' in n ? (
          <div className="nav-section" key={`s-${i}`}>
            {n.section}
          </div>
        ) : (
          <button
            className="nav-item"
            key={n.key}
            {...(active === n.key ? { 'aria-current': 'page' as const } : {})}
          >
            <Icon id={n.icon} s={17} />
            <span>{n.label}</span>
            {'badge' in n && n.badge ? <i className="badge-count">{n.badge}</i> : null}
          </button>
        )
      )}
      <div className="sidebar-footer">
        <button className="workspace-pill" onClick={onSignOut} title="Abmelden">
          <span className="ws-avatar">PK</span>
          <span className="ws-meta">
            <span className="ws-name">Petja — Solo</span>
            <span className="ws-plan">Solo Pro</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
