import { Icon } from './Icon';
import { calcMomentum } from '@/lib/momentum';
import type { DashboardData, Task, Habit } from '@/lib/useDashboard';

const PRIO: Record<string, [string, string]> = {
  high: ['prio-high', 'Hoch'],
  medium: ['prio-med', 'Mittel'],
  med: ['prio-med', 'Mittel'],
  low: ['prio-low', 'Niedrig'],
};
const prio = (p: string): [string, string] => PRIO[p?.toLowerCase()] ?? ['prio-med', p || 'Mittel'];

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
}
function dateLabel(): string {
  const s = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const todayISO = () => new Date().toISOString().slice(0, 10);

function TaskRow({ t }: { t: Task }) {
  const [pc, pl] = prio(t.priority);
  const done = t.status === 'done';
  const due = t.scheduled_for === todayISO() ? 'Heute' : (t.scheduled_for ?? null);
  const tags = t.tags ?? [];
  return (
    <div className={`task-row${done ? 'done' : ''}`} role="button" tabIndex={0}>
      <span className="task-check" aria-label="Aufgabe abschließen">
        {done ? <Icon id="i-check" s={11} /> : null}
      </span>
      <span className="task-body">
        <span className="task-title">{t.title}</span>
        <span className="task-meta">
          {t.is_obt && (
            <>
              <span className="obt-flag">
                <Icon id="i-dot" s={10} />
                OBT
              </span>
              <span className="sep">·</span>
            </>
          )}
          <span className={`prio ${pc}`}>
            <Icon id="i-flag" s={11} />
            {pl}
          </span>
          {tags.map((x) => (
            <span className="tag" key={x}>
              {x}
            </span>
          ))}
          {due && (
            <>
              <span className="sep">·</span>
              <span className={`due ${due === 'Heute' ? 'today' : ''}`}>
                <Icon id="i-cal" s={11} />
                {due}
              </span>
            </>
          )}
          {t.estimated_minutes ? (
            <>
              <span className="sep">·</span>
              <span className="mono">{t.estimated_minutes} min</span>
            </>
          ) : null}
        </span>
      </span>
    </div>
  );
}

function HabitCard({ h, done }: { h: Habit; done: boolean }) {
  return (
    <div className="card habit-card">
      <div className="habit-head">
        <span className="habit-icon">
          <Icon id={h.icon || 'i-repeat'} s={17} />
        </span>
        <span>
          <div className="habit-name">{h.title}</div>
          <div className="habit-identity">{h.identity_statement}</div>
        </span>
      </div>
      <button className={`btn ${done ? 'btn-ghost' : 'btn-secondary'} btn-sm habit-action`}>
        {done ? 'Heute erledigt' : 'Abschließen'}
      </button>
    </div>
  );
}

export function Dashboard({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  const m = calcMomentum({
    tasksDone: data?.tasksDone ?? 0,
    habitsLogged: data?.habitLogIds.size ?? 0,
    obtDone: data?.obt?.status === 'done',
  });
  const obt = data?.obt ?? null;
  const tasks = data?.tasks ?? [];
  const habits = data?.habits ?? [];
  const ringCirc = 326.7;

  return (
    <section className="view active">
      <p className="eyebrow">{dateLabel()}</p>
      <h1 className="page-h1">{greeting()}, Petja.</h1>
      <p className="page-sub">Stiller Tag. Ein Fokus — der Rest kann warten.</p>

      <div className="stat-row">
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-trend" s={13} />
            Momentum
          </span>
          <span className="stat-value">{m.momentum.toLocaleString('de-DE')}</span>
          <span className="stat-foot">
            <span className="delta up">Level {m.level}</span> {m.levelName}
          </span>
        </div>
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-check-sq" s={13} />
            Heute erledigt
          </span>
          <span className="stat-value">{data?.tasksDone ?? 0}</span>
          <span className="stat-foot">Aufgaben abgeschlossen</span>
        </div>
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-repeat" s={13} />
            Gewohnheiten heute
          </span>
          <span className="stat-value">
            {data?.habitLogIds.size ?? 0}
            <span className="unit">/ {habits.length}</span>
          </span>
          <span className="stat-foot">geloggt</span>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-col">
          {obt ? (
            <div className="obt">
              <span className="eyebrow">One Big Thing</span>
              <h2 className="obt-title">{obt.title}</h2>
              <div className="obt-meta">
                {obt.estimated_minutes ? (
                  <span className="chip">
                    <Icon id="i-clock" s={11} />
                    {obt.estimated_minutes} min
                  </span>
                ) : null}
                <span className="chip">
                  <span className="dot" style={{ background: 'var(--accent)' }} />
                  {prio(obt.priority)[1]}
                </span>
              </div>
              <div className="obt-actions">
                <button className="btn btn-primary">
                  <Icon id="i-timer" s={15} />
                  Fokus starten
                </button>
                <button className="btn btn-secondary">Erledigt</button>
              </div>
            </div>
          ) : (
            <div className="obt" style={{ opacity: 0.7 }}>
              <span className="eyebrow">One Big Thing</span>
              <h2 className="obt-title">Noch kein Fokus für heute.</h2>
              <div className="obt-actions">
                <button className="btn btn-primary">
                  <Icon id="i-plus" s={15} />
                  Fokus wählen
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="section-h">
              Heute <span className="hint">{tasks.length} offen</span>
            </h3>
            <div className="task-list">
              {tasks.length ? (
                tasks.map((t) => <TaskRow t={t} key={t.id} />)
              ) : (
                <p className="hint" style={{ padding: 'var(--s-2) 0' }}>
                  {loading ? 'Lädt…' : 'Keine Aufgaben für heute.'}
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="section-h">
              Gewohnheiten heute{' '}
              <span className="hint">
                {data?.habitLogIds.size ?? 0} von {habits.length}
              </span>
            </h3>
            <div className="habit-grid">
              {habits.length ? (
                habits
                  .slice(0, 2)
                  .map((h) => (
                    <HabitCard h={h} done={data?.habitLogIds.has(h.id) ?? false} key={h.id} />
                  ))
              ) : (
                <p className="hint">{loading ? 'Lädt…' : 'Noch keine Gewohnheiten.'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="dash-col">
          <div className="card hoverable">
            <h3 className="section-h">Level-Fortschritt</h3>
            <div className="momentum">
              <div className="momentum-ring">
                <svg width="118" height="118" viewBox="0 0 118 118">
                  <circle className="track" cx="59" cy="59" r="52" fill="none" strokeWidth="7" />
                  <circle
                    className="fill"
                    cx="59"
                    cy="59"
                    r="52"
                    fill="none"
                    strokeWidth="7"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringCirc * (1 - m.pct)}
                  />
                </svg>
                <span className="momentum-num">
                  {Math.round(m.pct * 100)}
                  <span className="unit">%</span>
                </span>
              </div>
              <div className="momentum-info">
                <span className="momentum-level">
                  Level {m.level} — {m.levelName}
                </span>
                <div className="progress" style={{ width: 140 }}>
                  <span style={{ width: `${Math.round(m.pct * 100)}%` }} />
                </div>
                <span className="momentum-next mono">
                  {m.xpInLevel.toLocaleString('de-DE')} / {m.xpForNext.toLocaleString('de-DE')} XP
                  bis Level {m.level + 1}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-h">Journal</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 'var(--s-4)' }}>
              {data?.journalDone
                ? 'Heute schon reflektiert. Stark.'
                : 'Der Abend gehört der Reflexion. Was war heute der beste Moment?'}
            </p>
            <button className="btn btn-secondary btn-sm">
              <Icon id="i-pen" s={13} />
              {data?.journalDone ? 'Eintrag ansehen' : 'Eintrag beginnen'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
