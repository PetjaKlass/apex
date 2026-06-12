# Apex — Audit-Report

> **Datum:** 2026-06-10 · **Auditor:** Claude
> Vollständige Analyse aller 71 Projektdokumente + Web-Verifikation der technischen Annahmen (Stand Juni 2026).
> Legende: ✅ = von mir bereits korrigiert · 🔧 = Entscheidung/Aktion von Petja nötig · 📋 = im Backlog dokumentiert

---

## Gesamturteil

Die Dokumentation ist für ein Solo-Projekt außergewöhnlich tief und professionell — insbesondere `phase-09-EXPANDED.md`, die ADRs (0008, 0010, 0011, 0013) und das Designsystem. **Aber:** Es gab 7 kritische Fehler, die das Projekt Geld, Rechtssicherheit oder Monate gekostet hätten. Alle klaren Fehler habe ich direkt korrigiert; die Entscheidungsfragen stehen unten.

Das systemische Grundproblem: **Mehrere Dokumente beschreiben die Zukunft als Vergangenheit.** Launch-Texte behaupten „6+ Monate tägliche Nutzung" (Dogfooding-Log: leer), die AVV-Checkliste war komplett abgehakt (kein einziger Vertrag existiert), Querverweise zeigen auf eine veraltete Phasen-Nummerierung. Einzeln harmlos, zusammen gefährlich — solche Dokumente steuern später Claude-Code-Sessions und damit echten Code.

---

## 1. Kritische Befunde (alle behoben oder entschärft)

### 1.1 ✅ Roadmap-Logikfehler: 30-Tage-Dogfooding ohne Features
`phases/README.md` — Stage 1 verlangte „Petja nutzt Apex 30 Tage täglich, Core Loops fühlen sich richtig an (Tasks, Habits, Focus, Rituale)". Diese Features werden aber erst in Phasen 14–19 (Stage 2) gebaut. Stage 1 endet mit Dashboard-Platzhaltern — 30 Tage Dogfooding damit ist unmöglich.
**Fix:** Stage-1-Ziel umdefiniert auf „technisches Fundament validiert"; neues **Mid-Stage-2 Dogfooding-Gate nach Phase 19, vor Payments (22) und App-Stores (21)**. Erst echte Nutzung, dann Geld verlangen.

### 1.2 ✅ Preis-Widerspruch mit echtem Geldschaden-Potenzial
`product-vision.md` (kanonisch): Solo €99/Jahr, Duo €249/Jahr. `billing-setup.md` + `phase-22`: **€120/€290**. Diese Zahlen wären direkt in Stripe gelandet.
**Fix:** Alles auf €99/€249 angeglichen (≈30% Jahresrabatt, passt zur Positionierung). Lifetime Deal €199 (war nirgends außer der Vision dokumentiert) in `billing-setup.md` ergänzt. „Annual = 32% off" korrigiert (real: 31%/28%). LTV-Rechnung €15→€12 korrigiert.
🔧 **Deine Entscheidung:** €99/€249 (~30% Rabatt) oder €120/€290 („2 Monate gratis")? Ich habe das kanonische Dokument gewinnen lassen — wenn du das andere Modell willst, sag Bescheid, dann ändere ich beide Stellen.

### 1.3 ✅ PowerSync Sync Rules waren technisch ungültig
`data-model.md` nutzte `IN (SELECT ...)`-Subqueries in Data Queries. **PowerSync Sync Rules unterstützen keine Subqueries/JOINs** — Deploy wäre fehlgeschlagen (verifiziert: docs.powersync.com).
**Fix:** `workspace_id` auf alle 7 Kindtabellen denormalisiert (vision_values, key_results, project_kanban_columns, task_assignees, knowledge_tags, financial_transactions, habit_logs), Sync Rules neu geschrieben, Parameter-Queries vereinfacht. **Gleiches Problem in `phase-09-EXPANDED.md`:** dort nutzen die Data Queries JOINs — im Legacy-Format ebenso unzulässig; Korrektur-Banner eingefügt. Das gute `visibility`-Konzept (shared/private Finanzkonten) aus EXPANDED habe ich umgekehrt in data-model.md übernommen.
📋 **Empfehlung Phase 09:** PowerSync **Sync Streams** (Beta, offiziell für neue Projekte empfohlen) direkt von Anfang an — die können JOINs/Subqueries und machen die Denormalisierung überflüssig.

### 1.4 ✅ RLS-Helper im gesperrten Schema + fehlender EXECUTE-Grant
`data-model.md` legte `auth.user_workspaces()` an. Supabase sperrt seit April 2025 eigene Objekte im `auth`-Schema — Migration wäre fehlgeschlagen. Zusätzlich dokumentiert `security-tests.md` einen offenen Befund: 25 Tabellen-Policies rufen Helper ohne EXECUTE-Recht für `authenticated` auf → ab Phase 10 wären **alle Writes** fehlgeschlagen.
**Fix:** Funktion in privates Schema `app` verlegt, `SET search_path`, `REVOKE/GRANT EXECUTE` ergänzt, alle Policy-Beispiele angepasst.

### 1.5 ✅ Fiktive Behauptungen in Launch-Materialien (Abmahn-Risiko)
4 Launch-Dateien behaupten „6+ months daily use" — der Dogfooding-Log ist **leer**. Dazu `https://apex.app` als konkrete URL (gehört dir nicht). Irreführende Werbung (§5 UWG) + HN würde es zerlegen.
**Fix:** Alle Claims durch `[ECHTE DAUER aus dogfooding-log.md]`-Platzhalter ersetzt, Entwurfs-Banner eingefügt, URL als Platzhalter markiert.

### 1.6 ✅ DSGVO-Lücke: Anthropic (AI Coach)
`architecture.md` behauptete „Anthropic now offers EU region" — **falsch** (Stand 06/2026: Direct API nur US/global; verifiziert). Anthropic fehlte komplett in der AVV-Vendor-Tabelle von ADR 0010, obwohl der AI Coach Journal-/Ziel-Daten dorthin schickt.
**Fix:** Korrekte Faktenlage eingetragen (DPA ist self-serve in den Commercial Terms ✓), Anthropic-Zeile in ADR 0010 ergänzt, Pfad definiert: **DPA + SCC + DPIA + Datenminimierung** — Alternative AWS Bedrock / Google Vertex mit EU-Region. AVV-Checkliste in `architecture.md` von „alles abgehakt" auf ehrlich offen zurückgesetzt.

### 1.7 ✅ Steuer-K.O.-Risiko: Kleinunternehmer & OSS fehlten
Phase 22 sagte nur „USt for EU customers". Bei digitalen B2C-Leistungen ist die USt **ab dem ersten Euro im Käuferland** fällig — ohne OSS-Registrierung drohen Registrierungspflichten in jedem EU-Land. §19 UStG (Kleinunternehmer) war unbehandelt.
**Fix:** Steuer-Block in `billing-setup.md` ergänzt. 🔧 **Vor Stripe-Live-Gang: Steuerberater mit SaaS-Schwerpunkt.** Nicht optional.

---

## 2. Hohe Priorität (behoben)

| # | Befund | Status |
|---|--------|--------|
| 2.1 | **Doppelte Phase-09-Dateien** — Stub enthielt sicherheitskritisch falsche Details (service_role für PowerSync statt `powersync_role`, alte Syntax) | ✅ Stub mit SUPERSEDED-Banner markiert, verweist auf EXPANDED |
| 2.2 | **ADR 0011 verwies 5× auf „Phase 16"** für AI Coach (ist Phase 24); gleicher Fehler in `architecture.md` | ✅ korrigiert |
| 2.3 | **ADR 0010 Checkpoints** nutzten veraltete Phasen-Nummern (15/22/24 aus altem Plan) | ✅ auf 08/13/07+23/24 korrigiert, AI-Coach-Checkpoint ergänzt |
| 2.4 | **Stage-1-Widerspruch Marketing-Site** („No marketing site until Stage 2" vs. Phase 07 baut sie in Stage 1) | ✅ Definition präzisiert: Fundament Stage 1, Polish Stage 2 |
| 2.5 | **Energy-Slider 1–5 (UI) vs. Schema 1–10** | ✅ Schema auf 1–5 mit CHECK-Constraint standardisiert |
| 2.6 | **`tasks` hatte keine `tags`-Spalte** — du willst explizit Notion-artige Properties (Deadline ✓, Bereich ✓, Priorität ✓, Tags ✗) | ✅ `tags text[]` + GIN-Index ergänzt |
| 2.7 | **`updated_at` fehlte auf den meisten gesyncten Tabellen**, obwohl das eigene Dokument es für Last-Write-Wins vorschreibt | ✅ Regel-Hinweis + Spalten auf goals/projects/habits ergänzt |
| 2.8 | **`xp_state`: PK user_id, aber NOT NULL workspace_id** — undefiniert bei 2 Workspaces | ✅ workspace_id entfernt (XP ist global pro User, wie im Doc beschrieben) |
| 2.9 | **`habit_logs` im privaten Bucket** — Duo-Partner hätte Habit-Fortschritt nie gesehen (Accountability = Kern-Feature von Duo) | ✅ in workspace_shared verschoben, Begründung dokumentiert |
| 2.10 | **expo-audio-Code nutzte die alte expo-av-API** (`Audio.Sound.createAsync` — in SDK 55+ entfernt, hätte nicht kompiliert) | ✅ auf `createAudioPlayer`/`useAudioPlayer` umgeschrieben |
| 2.11 | **Kalender-Privacy-Widerspruch** — „never sent to server" vs. `calendar_events`-Tabelle wird via PowerSync gesynct | ✅ README korrigiert; Datenschutzerklärung muss Kalender-Cache ausweisen |
| 2.12 | **product-vision.md beschrieb Capacitor-Distribution** — durch ADR 0001 längst verworfen (Expo) | ✅ Distribution-Tabelle korrigiert, Desktop auf Stage 3/Phase 29 angeglichen |
| 2.13 | **Affiliate-Versprechen vs. Implementierung** — „30% × 12 Monate" versprochen, nur Einmal-Provision gebaut | ✅ Blocker-Warnung + UWG-Hinweis (Kaltakquise) in `affiliate-setup.md` |
| 2.14 | **Tauri-Phase 29 „2-3 Tage"** — unrealistisch (Notarisierung, EV-Zertifikat 5–10 Werktage Vorlauf, Auto-Update-Signing) | ✅ auf L (5–10 Tage) korrigiert |
| 2.15 | **Falsche Preisangaben für Dienste** — EAS „Production $19" (real: Starter $19, Production $199), PowerSync „Starter $49/Pro $199" (real: Pro $49, Team $599), Supabase „$25 pro Projekt" (real: pro Organisation) | ✅ Kostentabellen korrigiert |
| 2.16 | **E-Mail-Verifikation lokal deaktiviert** (ADR 0013) — offene Sicherheitslücke vor Production | ✅ als Blocker in AVV-/Launch-Checkliste verankert |

---

## 3. Offene Punkte für die Implementierung (📋 Backlog)

1. **Migrations-Nummern-Konflikt:** `phase-11` plant `0014_onboarding_complete.sql`, aber Phase-09-EXPANDED vergibt 0006–0022 (0014 = knowledge) und legt `onboarded_at` bereits in 0006 an. → Phase 11 braucht KEINE eigene Migration; beim Ausführen prüfen.
2. **Phase-08-Spec beschreibt den lokalen Auth-Handoff, der nachweislich nicht funktioniert** (Cross-Port-Cookies) — ADR 0013 ist die Wahrheit. Spec bei Gelegenheit aktualisieren.
3. **Storybook ist laut `phases/log.md` gestrichen** (NativeWind-Inkompatibilität), steht aber noch in Phasen 04–06. Beim Ausführen ignorieren bzw. Specs bereinigen.
4. **`npm install` in pnpm-Monorepo** (`phase-09-EXPANDED:690`) → `pnpm add @powersync/react --filter @apex/product`.
5. **Expo SDK:** Dokumente sagen SDK 55; aktuell ist **SDK 56** (RN 0.85, Hermes v1). Bei Phase 01 die dann neueste stabile Version nehmen. (`architecture.md` ist angepasst.)
6. **Recharts (Phase 25)** läuft nicht in React Native — für Mobile Victory Native o.ä. einplanen.
7. **tsdav (Phase 28)** ist Node-orientiert; auf Deno (Edge Functions) vorher testen.
8. **Apple External-Payment-Links:** USA aktuell provisionsfrei erlaubt (Epic v. Apple, Berufung läuft — nicht garantiert dauerhaft); EU seit 01/2026 neues Modell (Core Technology Commission 5% statt CTF + Store Services Fee). Phase 21/22 braucht eine Pro-Markt-Strategie, sonst Review-Rejection-Risiko.
9. **Resend:** EU-*Sende*region ja, aber Account-Daten/Logs in den USA — in Datenschutzerklärung & AVV-Übersicht so ausweisen (in `architecture.md` korrigiert).
10. **PostHog/TTDSG:** Prüfen ob die konkrete PostHog-Konfiguration (Cookies/localStorage) ein Consent-Banner im Product-App-Bereich erfordert.
11. **Store Age-Rating 4+/Everyone** vs. sehr persönliche Daten (Journal, Finanzen): Mindestalter 16 in AGB/Privacy aufnehmen (Art. 8 DSGVO).
12. **Podcast-Vorlauf** realistisch 8–12 Wochen (nicht 4–6) — Launch-Timeline entsprechend planen.
13. **`docs/design-system/components/` (21 Komponenten-Specs) existiert nicht**, wird aber von design-system.md, architecture.md und Phasen 04–06 referenziert. → Auf Zuruf erstelle ich alle 21 Specs; der neue Design-Prototyp (`design/design-preview.html`) dient bis dahin als visuelle Referenz.
14. **ADR-Diskrepanz:** ADR 0001/0009 nennen „Expo SDK 52" im Text — historisch okay (ADRs friert man ein), aber bei Phase 01 nicht von dort abschreiben.

---

## 4. Strategische Beobachtungen (deine Entscheidungen)

### 4.1 Dein Brief vs. die Dokumente — der eine echte Konflikt
Dein Anspruch: *„alle Lebensbereiche abdecken statt 12 Apps, lebenslang nutzen, wächst nach Bedarf, Notion-artige Eigenschaften."* Die Dokumente sagen an mehreren Stellen das Gegenteil: *„Not a Notion replacement. Fixed schemas. No custom fields. Apex configures the user."*

Beides zugleich geht nicht — und **die Dokumente haben recht, was den Start angeht**: Ein Solo-Founder, der „alles für alle" baut, launcht nie. Aber dein Wunsch ist als **Wachstumspfad** abbildbar:
- Das Datenmodell deckt bereits erstaunlich viel ab (Vision, Ziele, Tasks, Habits, Fokus, Journal, Wissen, Finanzen, Gesundheit, Kalender).
- „Wächst nach Bedarf" = die `areas`-Architektur ist der Hebel: neue Lebensbereiche sind Daten, keine Schema-Änderungen.
- Notion-Properties: Mit dem Tags-Fix hat `tasks` jetzt Deadline, Bereich, Tags, Priorität, Energie, Schätzung, Beschreibung, Subtasks, Recurrence — das ist die richtige Mitte zwischen „leerer Canvas" (Notion) und „zu starr".
- **Empfehlung:** Positionierung beibehalten (opinioniert, fokussiert), aber im Manifest/Vision-Doc einen Abschnitt „Expansion Path" ergänzen, der deinen Lebenslang-Anspruch als Stage-4+-Vision festhält. Sag Bescheid, dann schreibe ich ihn.

### 4.2 Think and Grow Rich ist unsichtbar
Dein Ausgangspunkt (Napoleon Hill) taucht in keinem Dokument auf — die Trigger-Bücher sind Atomic Habits/Deep Work. Inhaltlich ist Hill aber überall: Desire→Vision, Faith→Conviction Score, Autosuggestion→Affirmation/Morning Ritual, Organized Planning→Goals/Projects, Persistence→Habits/Streaks, **Master Mind→Duo**, Written Statement→The Letter. Das ist eine starke, differenzierende Marketing-Erzählung („das erste Life-OS, das Hills Prinzipien operationalisiert") — oder bewusst weglassen, um nicht esoterisch zu wirken. 🔧 Deine Entscheidung; beides ist vertretbar.

### 4.3 Kleinere strategische Anmerkungen
- **Plausible + PostHog parallel** = doppelte Analytics-Kosten/Komplexität. Für Stage 1–2 reicht PostHog (EU) für beides; Plausible erst, wenn Marketing-SEO-Reporting wichtig wird.
- **North-Star „Active Daily Reflectors"** ist exzellent gewählt — behalten.
- **„AI Coach included" (Vision) vs. „Add-on €5" (README)** ist KEIN Widerspruch (200 Calls inkludiert, Add-on für mehr), sollte aber in Pricing-Kommunikation immer zusammen erklärt werden.

---

## 5. Was bemerkenswert gut ist

`phase-09-EXPANDED.md` (Adversarial-Security-Tests mit konkretem SQL, korrekte `powersync_role`-Architektur), ADR 0008 (Vendor-Exit-Strategie), ADR 0013 (ehrliche Selbstkorrektur), `security-tests.md` (offene Befunde ehrlich dokumentiert), das Designsystem (Tokens, Motion-Choreografie, Anti-Patterns, Voice & Tone auf Senior-Niveau), `phases/log.md` (echte Lernkultur). Diese Qualität ist die Basis, auf der sich das Projekt lohnt.

---

## 6. Neue Dateien