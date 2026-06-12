# FocusTimer — Cinema-Pomodoro

> `apps/product/components/focus/FocusTimer.tsx` + FocusMode-Screen · Phase 16 · Konventionen: `README.md`

## Zweck
Der Deep-Work-Moment. Die App tritt zurück (Cinema-Mode), übrig bleiben Ring, Zeit, eine Aufgabe. Ring = Goldener-Faden-Familie (S1); Ziffern = S3.

## Anatomie (Cinema-Stage)
```
        EYEBROW „DEEP-WORK-SESSION"
        ◯ Ring min(320px, 72vw), Track 5px bg-subtle, Fill 5px accent (12 Uhr, round caps)
          37:30 — mono/600, clamp(40px,7vw,54px), tnum
        „Arbeitet an: <Task>" 15px (Task fett text-1, Rest text-2)
        [Pause (secondary lg)] [Session beenden (ghost)] [Chip: Ambient „Regen"]
Stage-Hintergrund: radialer accent-glow, „atmet" 7s ±30% Opazität
Cinema: Sidebar opacity .05 + pointer-events none, Topbar .25 — 400ms springOut
```

## Timer-Logik (kritisch — hier sterben Pomodoro-Apps)
- **Wahrheit ist `endsAt` (Timestamp), nie ein dekrementierender Counter.** Anzeige = `endsAt − now`, jede Sekunde neu gerechnet. Backgrounding/Suspend (iOS/Android) ändert dadurch nichts — beim Foreground stimmt die Zeit sofort.
- Intervall: 1s; bei `requestAnimationFrame`-Drosselung im Hintergrund-Tab egal (Neuberechnung beim Sichtbarwerden, `visibilitychange`).
- Presets: 25/5 · 50/10 · 90/20 · custom (5–120). Pausenphase = gleicher Ring, Fill in `info`, Eyebrow „PAUSE".
- **Pause** (User): friert `endsAt` ein (speichert `remainingMs`); Resume setzt neues `endsAt`. Max. Pausenzeit zählt nicht als Fokuszeit.
- **Ende:** Ring vollendet → Fill-Puls (600ms) + Sound `focus-end` (falls an) + Success-Haptik + XP. Session-Write (PowerSync): `started_at, ended_at, planned/actual_minutes, task_id`.
- **Abbruch** („Session beenden" vor Ablauf): Confirm-Modal („Session nach 12 min beenden?"); `actual_minutes` ehrlich gespeichert, anteilige XP ab 10 min (sonst 0 — keine 30-Sekunden-Farming-XP).
- App-Kill während Session: beim nächsten Start Recovery-Prompt („Session lief noch — 23 min übernehmen?").

## Cinema-Mode-Regeln (aus §16, hier verbindlich)
- Eintritt 400ms (Sidebar/Topbar faden, Stage expandiert), ESC oder „Beenden" verlässt (mit Confirm bei laufender Zeit). Android-Back ebenso.
- Keine Toasts, keine Badge-Updates, keine Haptik außer direkter Interaktion. Notifications der App unterdrückt (System-DND ist Sache des Nutzers — wir verlinken nur den Tipp im Onboarding).
- Web: Cursor nach 3s Inaktivität ausblenden (`cursor:none` auf Stage, Bewegung blendet ein).
- Wake-Lock: Web `navigator.wakeLock` (wenn verfügbar), native `expo-keep-awake` — Bildschirm bleibt an.

## Ambient-Sound
Chip zeigt aktuelle Auswahl; Tap → Sheet mit 7 Sounds + „Aus" + Lautstärke. `expo-audio`-Player geloopt, Crossfade 800ms bei Wechsel (Web: WebAudio-Gain). Spielt NUR während Session; Pause pausiert Ambient mit.

## States
idle (Preset-Wahl, Ring leer) · running · paused · break · completed (3s Ausklang, dann Summary: Minuten, XP, „Weiter arbeiten?" = neue Session mit gleichem Task) · recovering.

## Plattform
- Ring identisch zu MomentumOrb-Technik (SVG + Reanimated; Offset-Update 1×/s mit 1s-linear-Tween → optisch kontinuierlich).
- Hintergrund-Verhalten iOS: Timer-Notification optional („Session endet in 2 min", expo-notifications, lokal) — Phase 21 verdrahtet.
- Reduced Motion: kein Atmen, Ring-Updates instant, Cinema-Eintritt als Cut.

## Props (Vertrag)
```ts
export type FocusTimerProps = {
  session: { taskId?: string; preset: '25/5'|'50/10'|'90/20'|'custom'; customMin?: number };
  state: 'idle'|'running'|'paused'|'break'|'completed';
  endsAt?: number; remainingMs?: number;     // Wahrheit: endsAt
  ambient?: AmbientSound | null;
  onStart/onPause/onResume/onEnd/onAmbientChange: …;
};
```

## Abnahme-Checkliste
- [ ] 50-min-Session: Backgrounding 10 min → Zeit exakt; Tab-Wechsel Web → exakt
- [ ] Ziffern springen nie (tnum); Ring 1×/s flüssig, 60fps, kein Drift zum Zeitende (±1s)
- [ ] Abbruch-/Recovery-/Kill-Pfade schreiben ehrliche `actual_minutes`
- [ ] Cinema unterdrückt Toasts/Haptik; ESC/Back mit Confirm; Cursor-Hide Web
- [ ] Wake-Lock beide Plattformen; Ambient crossfaded, stoppt bei Pause/Ende
- [ ] XP-Regel: <10 min = 0 XP (Anti-Farming) — getestet
