import { Icon } from './Icon';

type Task = {
  id: number;
  title: string;
  obt?: boolean;
  prio: 'high' | 'med' | 'low';
  area: [string, string];
  tags: string[];
  due: string;
  today?: boolean;
  est: string;
  done?: boolean;
};

const TASKS: Task[] = [
  {
    id: 1,
    title: 'PowerSync Sync-Rules deployen und adversarial testen',
    obt: true,
    prio: 'high',
    area: ['Business', 'var(--accent)'],
    tags: ['deep-work', 'infrastruktur'],
    due: 'Heute',
    today: true,
    est: '90 min',
  },
  {
    id: 2,
    title: 'AVV mit Supabase und PowerSync abschließen',
    prio: 'high',
    area: ['Business', 'var(--accent)'],
    tags: ['dsgvo'],
    due: 'Heute',
    today: true,
    est: '20 min',
  },
  {
    id: 3,
    title: 'Intervall-Lauf 6 × 800 m',
    prio: 'med',
    area: ['Gesundheit', 'var(--info)'],
    tags: ['marathon'],
    due: 'Heute',
    today: true,
    est: '50 min',
  },
  {
    id: 4,
    title: 'Wochenrechnung an Klient K. senden',
    prio: 'low',
    area: ['Finanzen', 'var(--success)'],
    tags: ['admin'],
    due: 'Heute',
    today: true,
    est: '10 min',
    done: true,
  },
];

const PRIO: Record<Task['prio'], [string, string]> = {
  high: ['prio-high', 'Hoch'],
  med: ['prio-med', 'Mittel'],
  low: ['prio-low', 'Niedrig'],
};

function TaskRow({ t }: { t: Task }) {
  const [pc, pl] = PRIO[t.prio];
  return (
    <div className={`task-row${t.done ? 'done' : ''}`} role="button" tabIndex={0}>
      <span className="task-check" aria-label="Aufgabe abschließen">
        {t.done ? <Icon id="i-check" s={11} /> : null}
      </span>
      <span className="task-body">
        <span className="task-title">{t.title}</span>
        <span className="task-meta">
          {t.obt && (
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
          <span className="sep">·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                background: t.area[1],
                display: 'inline-block',
              }}
            />
            {t.area[0]}
          </span>
          {t.tags.map((x) => (
            <span className="tag" key={x}>
              {x}
            </span>
          ))}
          <span className="sep">·</span>
          <span className={`due ${t.today ? 'today' : ''}`}>
            <Icon id="i-cal" s={11} />
            {t.due}
          </span>
          <span className="sep">·</span>
          <span className="mono">{t.est}</span>
        </span>
      </span>
    </div>
  );
}

type Habit = {
  id: number;
  name: string;
  identity: string;
  icon: string;
  streak: number;
  week: (number | string)[];
};
const HABITS: Habit[] = [
  {
    id: 1,
    name: 'Lesen — 20 Seiten',
    identity: 'Ich bin jemand, der jeden Tag lernt.',
    icon: 'i-book',
    streak: 34,
    week: [1, 1, 1, 0, 1, 1, 'today'],
  },
  {
    id: 2,
    name: 'Laufen',
    identity: 'Ich bin jemand, der seinen Körper trainiert.',
    icon: 'i-activity',
    streak: 12,
    week: [1, 0, 1, 1, 0, 1, 'today'],
  },
];

function HabitCard({ h }: { h: Habit }) {
  const doneToday = h.week[6] === 'today-hit';
  const risk = h.week[6] === 'today';
  return (
    <div className="card habit-card">
      <div className="habit-head">
        <span className="habit-icon">
          <Icon id={h.icon} s={17} />
        </span>
        <span>
          <div className="habit-name">{h.name}</div>
          <div className="habit-identity">{h.identity}</div>
        </span>
        <span
          className={`streak${risk ? 'risk' : ''}`}
          title={risk ? 'Streak in Gefahr' : 'Aktueller Streak'}
        >
          <Icon id="i-flame" s={13} />
          <span className="streak-n">{h.streak}</span>
        </span>
      </div>
      <div className="week-grid">
        {h.week.map((w, i) => {
          const today = w === 'today' || w === 'today-hit';
          const hit = w === 1 || w === 'today-hit';
          return (
            <span className="week-cell" key={i}>
              <span className={`week-dot ${hit ? 'hit' : ''} ${today ? 'today' : ''}`} />
            </span>
          );
        })}
      </div>
      <button className={`btn ${doneToday ? 'btn-ghost' : 'btn-secondary'} btn-sm habit-action`}>
        {doneToday ? 'Heute erledigt' : 'Abschließen'}
      </button>
    </div>
  );
}

export function Dashboard() {
  const today = TASKS.filter((t) => !t.done)
    .slice(0, 3)
    .concat(TASKS.filter((t) => t.done));
  return (
    <section className="view active">
      <p className="eyebrow">Donnerstag, 11. Juni 2026</p>
      <h1 className="page-h1">Guten Morgen, Petja.</h1>
      <p className="page-sub">Stiller Tag. Ein Fokus — der Rest kann warten.</p>

      <div className="stat-row">
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-trend" s={13} />
            Momentum
          </span>
          <span className="stat-value">847</span>
          <span className="stat-foot">
            <span className="delta up">+12 heute</span> Level 12 — Operator
          </span>
        </div>
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-timer" s={13} />
            Fokus diese Woche
          </span>
          <span className="stat-value">
            11,5<span className="unit">h</span>
          </span>
          <span className="stat-foot">
            <span className="delta up">+8 %</span> vs. letzte Woche
          </span>
        </div>
        <div className="card stat-card hoverable">
          <span className="stat-label">
            <Icon id="i-flame" s={13} />
            Längster Streak
          </span>
          <span className="stat-value">
            34<span className="unit">Tage</span>
          </span>
          <span className="stat-foot">
            <span className="delta flat">stabil</span> Lesen — täglich
          </span>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-col">
          <div className="obt">
            <span className="eyebrow">One Big Thing</span>
            <h2 className="obt-title">PowerSync Sync-Rules deployen und adversarial testen</h2>
            <div className="obt-meta">
              <span className="chip">
                <Icon id="i-folder" s={11} />
                Apex — Phase 09
              </span>
              <span className="chip">
                <span className="dot" style={{ background: 'var(--accent)' }} />
                Business
              </span>
              <span className="chip">
                <Icon id="i-clock" s={11} />
                90 min
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

          <div className="card">
            <h3 className="section-h">
              Heute <span className="hint">4 Aufgaben · 1 erledigt</span>
            </h3>
            <div className="task-list">
              {today.map((t) => (
                <TaskRow t={t} key={t.id} />
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-h">
              Gewohnheiten heute <span className="hint">2 von 3</span>
            </h3>
            <div className="habit-grid">
              {HABITS.map((h) => (
                <HabitCard h={h} key={h.id} />
              ))}
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
                    strokeDasharray="326.7"
                    strokeDashoffset="91.5"
                  />
                </svg>
                <span className="momentum-num">
                  72<span className="unit">%</span>
                </span>
              </div>
              <div className="momentum-info">
                <span className="momentum-level">Level 12 — Operator</span>
                <div className="progress" style={{ width: 140 }}>
                  <span style={{ width: '72%' }} />
                </div>
                <span className="momentum-next mono">2.840 / 3.200 XP bis Level 13</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-h">
              Quartalsziele
              <span className="segment right" role="group" aria-label="Zeitraum">
                <button aria-pressed="false">Woche</button>
                <button aria-pressed="true">Quartal</button>
              </span>
            </h3>
            <div className="goal-row">
              <div className="goal-top">
                <span className="goal-name">Apex Alpha live + 30 Tage Dogfooding</span>
                <span className="goal-pct">68 %</span>
              </div>
              <div className="progress">
                <span style={{ width: '68%' }} />
              </div>
            </div>
            <div className="goal-row">
              <div className="goal-top">
                <span className="goal-name">Marathon-Trainingsvolumen aufbauen</span>
                <span className="goal-pct">45 %</span>
              </div>
              <div className="progress">
                <span style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-h">Rituale</h3>
            <div className="ritual-row">
              <span className="ritual-state done" /> Morgenritual{' '}
              <span className="ritual-time">06:32</span>
            </div>
            <div className="ritual-row">
              <span className="ritual-state open" /> Abendritual{' '}
              <span className="ritual-time">offen</span>
            </div>
          </div>

          <div className="card hoverable">
            <h3 className="section-h">Journal</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 'var(--s-4)' }}>
              Der Abend gehört der Reflexion. Was war heute der beste Moment?
            </p>
            <button className="btn btn-secondary btn-sm">
              <Icon id="i-pen" s={13} />
              Eintrag beginnen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
