# ADR 0010 — DSGVO Compliance Strategy

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

Apex is operated by a German solo founder, targets EU users, processes personal data (productivity habits, journal entries, goals, finances). DSGVO (GDPR) applies fully. Non-compliance risks include:

- Abmahnungen (cease-and-desist letters) from competitors or consumer protection groups
- Bußgelder (fines) from Bayerisches Landesamt für Datenschutzaufsicht
- Reputational damage if data leak occurs without proper safeguards

Compliance is **mandatory**, not optional, regardless of where servers are hosted or whether the app is in English.

## Decision

**Apex implements full DSGVO compliance from Stage 1 onward.** All required infrastructure, processes, and documents are in place before public launch (Stage 2). EU-hosting is preferred wherever vendors offer it.

## Compliance Inventory

### Required Legal Documents (German + English)

All hosted on marketing site, linked from app footer:

| Document             | Path                  | Required by                   | Source                               |
| -------------------- | --------------------- | ----------------------------- | ------------------------------------ |
| Impressum            | `/imprint`            | TMG (German Telemediengesetz) | e-recht24 generator                  |
| Datenschutzerklärung | `/privacy`            | DSGVO Art. 13                 | e-recht24 + lawyer review pre-launch |
| AGB                  | `/terms`              | German contract law for B2C   | Template + lawyer review             |
| Cookie-Richtlinie    | section in `/privacy` | TTDSG                         | only if cookies set                  |

**All four exist before public launch.** Stage 1 alpha can use placeholders, Stage 2 beta requires real lawyer-reviewed versions.

### Auftragsverarbeitungsverträge (AVV / Data Processing Agreements)

Petja signs an AVV with every vendor processing personal data. List below; all checked before storing user data:

| Vendor                 | Processes                       | EU Region           | AVV                            |
| ---------------------- | ------------------------------- | ------------------- | ------------------------------ |
| Supabase               | Postgres, Auth, Storage         | Frankfurt           | Available, sign during Phase 1 |
| Vercel                 | Hosting both apps               | fra1 (Frankfurt)    | Available                      |
| PowerSync              | Data sync layer                 | EU (Ireland)        | Available                      |
| Stripe Payments Europe | Payments                        | Ireland (EU entity) | Available                      |
| Resend                 | Transactional + broadcast email | EU region           | Available                      |
| Plausible Analytics    | Marketing site analytics        | Germany             | Available, cookieless          |
| PostHog                | Product analytics               | EU region           | Available                      |
| Sentry                 | Error tracking                  | EU region           | Available                      |
| Cloudflare             | DNS only (no PII processing)    | Germany IPs         | DPA available                  |
| Expo (EAS)             | Build artifacts (no user data)  | US-based            | DPA + SCC; no PII processed    |
| **Anthropic** (AI Coach, ab Phase 24) | Goals/Habits/Journal-Kontext für Coaching | **US** (keine EU-Residenz für Direct API, Stand 06/2026) | DPA self-serve (in Commercial Terms) + SCC; **DPIA erforderlich**; Datenminimierung im Prompt; Alternative: Bedrock/Vertex EU |

**No vendor onboarded without AVV.** Adding a new vendor in Phase X requires completing AVV first.

### Technical Compliance Requirements

These are encoded in the codebase, not just policy:

#### Right to Access (DSGVO Art. 15)

User can view all data Apex holds about them.
**Implementation:** Settings → Data → "View my data" shows summary of all entities.

#### Right to Data Portability (DSGVO Art. 20)

User can export all their data in machine-readable format.
**Implementation:** Settings → Data → "Export my data" generates JSON file with all workspaces, tasks, habits, journals, etc. CSV per entity also available.

#### Right to Erasure (DSGVO Art. 17)

User can delete their account and all data is hard-deleted within 30 days.
**Implementation:**

- Settings → Account → "Delete account" with double confirmation
- Triggers: Stripe subscription cancel + Supabase user delete (cascades via FK CASCADE on workspace_members → workspaces → all entities)
- Edge Function runs nightly to permanently delete `auth.users` rows marked deleted
- Backups purged within 30 days per Supabase retention policy

**Note:** Hard delete not soft delete is the design. We CASCADE everything.

#### Right to Rectification (DSGVO Art. 16)

User can correct any data they hold.
**Implementation:** All user data is editable via the app (this is normal UX, but it's also a DSGVO requirement).

#### Right to Restriction (DSGVO Art. 18)

User can pause processing.
**Implementation:** Pausing the workspace plan stops new data processing. Stage 2 implementation.

#### Right to Object (DSGVO Art. 21)

User can object to specific processing.
**Implementation:** Notification preferences page allows turning off all marketing/digest emails. Account-level "do not process for analytics" toggle (Stage 2).

### Email Verification Before Payment

**Required.** No payment can be initiated until email is verified. Prevents fraud and ensures DSGVO consent is given by the actual user.

### Cookie Policy

**Marketing Site:** Plausible Analytics is cookieless — no cookie banner needed.
**Product App:** Auth cookies are functional/necessary (no consent banner required), but a footer note explains this.

If we ever add advertising cookies (we will not), a Cookie Banner becomes required.

### Logging & PII

- Sentry: SDK configured to scrub email addresses, names, IDs from error context
- Server logs: scrub PII at info+ levels, keep raw for debug levels which expire after 7 days
- PostHog: identify with hashed user_id, never with raw email
- Activity log (in DB): store user_id but display name via JOIN, never duplicated

### Breach Notification

DSGVO Art. 33 requires reporting data breaches to the supervisory authority within 72 hours.
**Implementation:**

- Supabase + Sentry alerts route to founder
- Documented incident response plan (Phase 25 task)
- Template breach notification email + procedure to BayLDA documented

### Subprocessor List

DSGVO requires informing users of subprocessors. List published on `/privacy` page and updated when new vendors added. Users can subscribe to subprocessor change notifications (Stage 3 enhancement).

### Data Protection Officer (DSB)

Solo operation: Petja is initially the DPO. Below thresholds requiring external DPO (typically 20+ employees or large-scale special category data processing). At 50+ employees or with high-risk processing, appoint external DPO.

### Records of Processing Activities (Verzeichnis von Verarbeitungstätigkeiten)

Required by DSGVO Art. 30 for all entities (yes, even solo founders).
**Implementation:** Maintained as `docs/dsgvo/processing-activities.md` (created Phase 1) listing:

- What data is processed
- Why (purpose)
- Legal basis (Art. 6: contract, legitimate interest, consent)
- Retention period
- Recipients (subprocessors)
- Technical & organizational security measures

## Compliance Checkpoints by Phase

### Phase 1 (Foundation)

- [ ] Sign AVV with Supabase
- [ ] Confirm EU regions (Frankfurt) for all services
- [ ] Create `docs/dsgvo/processing-activities.md` skeleton

### Phase 9 (Stores & Data Models)

- [ ] CASCADE delete confirmed on every workspace foreign key
- [ ] Hard delete tested end-to-end

### Phase 08 (Supabase + Auth) — _(Phasen-Nummern korrigiert; hier standen veraltete Nummern aus einem früheren Plan)_

- [ ] Email verification required before payment (lokal deaktiviert in Phase 08 — vor Production reaktivieren! Siehe ADR 0013)
- [ ] 2FA available
- [ ] Session cookies on `.apex.[domain]` with HttpOnly, Secure, SameSite=Lax

### Phase 13/20 (Settings-Funktionen, spätestens vor Public Beta)

- [ ] "View my data" page implemented
- [ ] "Export my data" JSON download implemented
- [ ] "Delete account" with confirmation flow implemented

### Phase 07 + 23 (Marketing site / Stage 2 prep)

- [ ] Imprint page (DE + EN)
- [ ] Datenschutzerklärung (DE + EN, lawyer-reviewed)
- [ ] AGB / Terms of Service (DE + EN, lawyer-reviewed)
- [ ] Subprocessor list

### Phase 24 (AI Coach)

- [ ] Anthropic DPA akzeptiert, SCC dokumentiert, DPIA durchgeführt
- [ ] Kontext-Datenminimierung implementiert (keine Klarnamen/E-Mails im Prompt)
- [ ] Privacy Policy um AI-Coach-Abschnitt erweitert (Opt-in-Hinweis)

### Pre-Launch (Stage 2)

- [ ] All AVVs signed and stored
- [ ] Lawyer review of legal documents complete
- [ ] Breach response plan documented
- [ ] Test: full account deletion, verify all data gone within 30 days

## Cost of Compliance

Estimated for solo founder:

| Item                                      | Cost                       |
| ----------------------------------------- | -------------------------- |
| e-recht24 generator subscription          | €10/month or one-time €100 |
| Lawyer review (one-time, pre-launch)      | €500-1,500                 |
| Lawyer retainer for questions (optional)  | €100-300/year              |
| Cookie banner tool (only if needed later) | €0-200/year                |
| Insurance: Cyber + Erfüllungshaftpflicht  | €300-800/year              |

Total: ~€1,000-2,500 first year. Predictable annual cost ~€500-1,000 thereafter.

**This is non-negotiable budget.** Skipping legal review to save €1,000 risks €5,000+ in Abmahnungen.

## Alternatives Considered

### "Don't comply, hope nobody notices"

**Rejected.** Active Abmahn-Kanzleien in Germany scan websites professionally. Probability of being caught approaches 100% within 12 months of public launch. Cost of one Abmahnung (€500-2,000) wipes out months of compliance savings.

### "Comply only when first user signs up"

**Rejected.** DSGVO obligations begin at first data collection (which is the contact form on landing page). Pre-collection compliance is required.

### "Use only US-based vendors, claim US-only operation"

**Rejected.** Not possible: founder is in Germany, EU users will sign up regardless of marketing focus. DSGVO applies based on user location, not vendor location. Adding US vendors (when EU exists) just makes compliance harder via Standard Contractual Clauses.

##