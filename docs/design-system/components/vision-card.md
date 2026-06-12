# VisionCard — Bild + Conviction-Meter

> `apps/product/components/vision/VisionCard.tsx` · Phase 18 · Konventionen: siehe `README.md`

## Zweck

Macht eine Vision körperlich sichtbar: ein 16:9-Bild (oder typografisches Fallback) mit eingebetteten Metadaten. Die einzige Karte, auf der der Conviction-Gradient (§3) erlaubt ist — er ist neben dem OBT-Faden die zweite Apex-Signatur, die Farbe bedeutungstragend einsetzt.

## Anatomie

```
╭──────────────────────────────────────╮  radius 20 · overflow hidden · 16:9
│ [Bild / Gradient-Fallback]           │  expo-image, contentFit cover, blurhash
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  dunkler Gradient unten: 60%→0% Deckkraft
│          Horizon-Chip [3 Jahre]       │  Chip oben rechts: Glas-Chip (card-glass +
│                                       │  border + edge, radius-full, 11px/500)
│ Titel der Vision           [Badge]   │  display 18/700 weiß · max 2 Zeilen
│──────────────────────────────────────│  Divider: transparent, kein Border
│ [Conviction-Bar 5px]           72    │  unter Bild: bg-card · padding 12 16
╰──────────────────────────────────────╯  Zahl: font-mono/600/tnum · text-1
```

## Bild-Bereich

- Seitenverhältnis 16:9 erzwungen via `aspectRatio: 16/9`.
- `expo-image`: `contentFit="cover"`, `placeholder={{ blurhash }}`, `transition={200}`.
- Gradient-Overlay über dem Bild: `linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 60%)` als absolutes Pseudo-Element / View-Overlay. Sorgt für Textlesbarkeit ohne feste Textfarbe am Bild anzupassen.
- Titel: absolut positioniert unten links, `color: #FFF` (fest, da immer auf dunklem Gradient), `font-display/18px/700/tracking-snug`, max. 2 Zeilen (`numberOfLines={2}`, `ellipsizeMode="tail"`).

## Horizon-Chip (oben rechts)

Beispiel „3 Jahre":
- `background: var(--card-glass)` + `border: 1px solid var(--border)` + `box-shadow: var(--edge)`
- `border-radius: var(--r-full)` · `padding: 3px 10px` · `font-ui/11px/500` · `color: rgba(255,255,255,0.88)` (auf dunklem Bild lesbar)
- Absolute Position: `top: 12px, right: 12px`.
- Inhalt: Zeithorizont in kompakter Lesart („3 Jahre", „6 Monate", „5 Jahre").

## Conviction-Meter (unter dem Bild)

Separater Streifen unterhalb des Bildbereichs, auf `var(--card)` Fläche:

```
padding 12px 16px · display flex · align-items center · gap 12px

[══════════════════════════▒▒▒▒▒▒]  72
 Fill: Conviction-Gradient (§3)     font-mono/600/tnum · 13px · text-1
 Track: 5px · bg-subtle + edge
```

Conviction-Gradient (score-abhängig, §3):
```ts
score < 30  → linear-gradient(90deg, #A84444, #B87A22)   // schwach
score < 60  → linear-gradient(90deg, #B87A22, #C9993A)   // formend
score < 85  → linear-gradient(90deg, #C9993A, #E8B84B)   // stark
score >= 85 → linear-gradient(90deg, #E8B84B, var(--accent-bright)) // unerschütterlich
```

Achtung: Conviction-Gradient verwendet feste Hex-Werte für die linke Farbe — er ist thematisch fix (Schwäche = Rot/Orange, Stärke = Gold). Er folgt NICHT dem Nutzer-Akzent (außer beim letzten Stop `accent-bright`). Das ist die definierte Ausnahme (§3 Conviction Gradient).

Breiten-Animation der Bar: wie in `progress.md` dokumentierte bewusste Ausnahme, 400ms spring.

## Fallback ohne Bild

Wenn kein Bild vorhanden:
- Gradient-Fläche: `linear-gradient(145deg, color-mix(in srgb, var(--accent) 20%, var(--canvas)), var(--canvas))`.
- Typo-Motiv: Horizon-Jahr als große Typografie-Dekoration im Hintergrund, `font-display/80px/800/opacity .08/text-1` — der Horizont als visuelles Element.
- Titel bleibt normal positioniert (unten links auf Gradient), weiterhin `#FFF`/`text-inverse`.

## States

| State | Darstellung |
|---|---|
| `active` | Standard-Darstellung |
| `paused` | Bild/Fläche zu 60% desaturiert (`filter: saturate(0.4)`); Horizon-Chip = „Pausiert" + `var(--onhold)` Punkt |
| `achieved` | Häkchen-Badge oben links (`CheckCircle2`, 18px, `var(--success)`); 1px `accent-border` um die gesamte Karte; Bild normal |

`paused` ist der einzige Ort in Apex, wo `filter: saturate()` auf einem visuellen Element erlaubt ist — es ist statisch, nicht animiert, und semantisch notwendig (visuelles „grau" für pausiert). Nicht animieren.

Badge bei `achieved`: absolut positioniert `top: 12px, left: 12px`, `background: var(--success)`, `border-radius: 9999`, `padding: 4px`, Icon weiß.

## Mikro-Interaktion

- Hover (Web, `hoverable` da gesamte Karte klickbar): translateY(-2px) + shadow-panel, 150ms springOut.
- Press (nativ): Haptik Light.
- Klick/Press öffnet Vision-Detail-Screen (Drill-Transition, §12).

## Verhalten & Edge Cases

- Conviction-Bar Breite: `value / 100` normalisiert, geclampt [0,1]. `score=0` → Bar unsichtbar (width 0).
- Titel > 2 Zeilen: ellipsis. Voller Titel im Vision-Detail lesbar.
- Karte in einer Liste: gap 16px, vertikaler Stack auf Mobil, 2-Spalten-Grid ab 640px.
- Kein zweites Bild innerhalb der Karte (Layer-Regel: kein Bild-in-Karte-in-Bild).
- Bild-Ladefehler → Fallback-Gradient sofort (kein broken-image-Icon, kein Flicker).

## Accessibility

- `accessibilityRole="button"` (Karte ist klickbar).
- `accessibilityLabel`: `"{Titel}, Vision, {Horizon-Label}, Conviction {Score} von 100, {State}"`.
- Beispiel: `"In drei Jahren Unternehmer, Vision, 3 Jahre, Conviction 72 von 100, aktiv"`.
- Status `achieved`: `", erreicht"` am Ende des Labels.
- Bild: `alt` / `accessibilityLabel` = Titel der Vision (Bild ist kontextuell, nicht dekorativ).
- Conviction-Bar: `role="progressbar"`, `aria-valuenow={score}`, `aria-label="Conviction-Score"`.

## Plattform

- **Web:** `expo-image` oder `<img>` mit object-fit: cover. CSS-Gradient-Overlay via `::after`.
- **Native:** `expo-image` + `View` mit `LinearGradient` (expo-linear-gradient) als absolute Overlay.
- Desaturierung bei `paused`: Web `filter: saturate(0.4)` auf Bild-Container; Nativ kein nativer Filter-Support — Fallback: Grau-Gradient-Overlay (rgba(0,0,0,0.35) gleichmäßig) + Chip-Label.

## Props (Vertrag)

```ts
export type VisionCardProps = {
  title: string;                             // max 2 Zeilen, danach ellipsis
  horizon: string;                           // z. B. „3 Jahre" für Chip
  convictionScore: number;                   // 0–100
  imageUrl?: string;
  imageBlurhash?: string;
  state?: 'active' | 'paused' | 'achieved'; // default 'active'
  onPress: () => void;                       // öffnet Vision-Detail
};
```

## Abnahme-Checkliste

- [ ] 16:9-Verhältnis erzwungen, kein Verzerren bei anderen Container-Breiten
- [ ] Bild-Gradient 60→0% Deckkraft; Titel auf Gradient lesbar (weiß, mind. 4.5:1)
- [ ] Horizon-Chip oben rechts: Glas-Chip (card-glass), korrekte Position auf Bild
- [ ] Conviction-Bar: Gradient korrekt nach Score-Schwellen (<30/<60/<85/≥85)
- [ ] `paused`: 60% Desaturierung (Web Filter / Native Overlay), Chip-Text „Pausiert"
- [ ] `achieved`: Häkchen-Badge oben links, 1px accent-border um Karte
- [ ] Fallback ohne Bild: Accent-Canvas-Gradient + Horizon-Jahr-Typo (opacity .08)
- [ ] accessibilityLabel vollständig (Titel, Horizon, Score, State)
- [ ] Conviction-Bar: role=progressbar, aria-valuenow
- [ ] Hover translateY(-2px) shadow-panel; Reduced-motion kein Transform
- [ ] Kein Gradient-Einsatz außer Conviction-Bar und Bild-Overlay (§3 Regeln)
