# Phase 09 — Adversarial Security Tests

> Durchgeführt nach Phase C (PowerSync Client SDK). Alle 5 Tests müssen bestehen bevor Phase 10 beginnt.
>
> **HARD STOP: Bei jedem FAIL — stoppen, Ursache debuggen, erneut prüfen.**

---

## Testumgebung

- **Product App:** `http://localhost:8081` (Expo Web, `pnpm --filter product dev`)
- **PowerSync:** `https://6a227df10ef84ed6719f1cc3.powersync.journeyapps.com`
- **Supabase Cloud:** `https://irhpyirvmxsopcycszyq.supabase.co`
- **Test-User A:** `peter.klass1990+sync1@gmail.com` → `cb643276-9cf6-458f-9845-5f3274146458`, Solo-WS `cdf95c5e-527c-4b46-864e-c4d527ff4755`
- **Test-User B:** `peter.klass1990+sync2@gmail.com` → `df9d1cc4-4980-4f40-9043-d0b4fce4dc0c`, Solo-WS `bd2be779-d5b7-426c-a095-2c1b2f3ea6ca`
- **Duo-WS (Test 2 + 5):** `dddddddd-dddd-dddd-dddd-dddddddddddd` (Owner A, Member B)

> **Ausführung 2026-06-06 (Server-seitig, autonom):** Tests 1, 2, 5 wurden server-seitig
> gegen die Cloud-DB verifiziert — zweischichtig:
>
> 1. **Sync-Rule-Simulation** (als `postgres`/BYPASSRLS = exakt der PowerSync-Lesepfad):
>    die `sync-rules.yaml`-Queries mit eingesetzter `user_id` ausgeführt → prüft, welche
>    Rows tatsächlich in die lokale SQLite jedes Users synchronisiert würden.
> 2. **RLS-Direktzugriff** (`SET ROLE authenticated` + JWT-Claims): prüft die
>    Defense-in-Depth-Schicht für direkten REST-/RPC-Zugriff und den INSERT-Angriff.
>
> Tests 3 (Offline-LWW) und 4 (Logout-Wipe) sind **rein client-seitig** (PowerSync-Local-Verhalten)
> und müssen im Browser ausgeführt werden — Anleitung siehe jeweiliger Test.
>
> ⚠️ **Befund während der Ausführung:** siehe Abschnitt „Befund: RLS-Helper-Permissions" am Ende.

### SQLite abfragen (Web)

Im Browser (localhost:8081) — DevTools Console:

```javascript
// PowerSync db ist global erreichbar:
const rows = await window.__powersync__.execute('SELECT * FROM tasks');
console.table(rows.rows._array);
```

Alternativ mit dem PowerSync Diagnostics-Endpunkt:
`http://localhost:8081` → Auth → dann in Console `db` tippen (falls global exposed).

### Test-User anlegen

1. App öffnen (`localhost:8081`)
2. "Registrieren" mit `peter.klass1990+sync1@gmail.com` — Gmail leitet das an die echte Adresse
3. Wiederhole mit `peter.klass1990+sync2@gmail.com`
4. Jeder User bekommt automatisch ein Solo-Workspace via `handle_new_user()`-Trigger

---

## Test 1: Bucket Isolation (zwei Solo-User)

**Ziel:** User A sieht ausschließlich seine eigenen Daten — keine Zeile aus User B's Workspace.

### Setup

```sql
-- Als User A einloggen, dann via Supabase SQL Editor oder direktem INSERT:
-- (Supabase Dashboard → SQL Editor → mit User A's session_id)
INSERT INTO tasks (workspace_id, title, status, priority, energy, created_by, position)
VALUES
  ('<user_a_workspace_id>', 'Task A1', 'todo', 'high', 'medium', '<user_a_id>', 0),
  ('<user_a_workspace_id>', 'Task A2', 'todo', 'medium', 'low', '<user_a_id>', 1),
  ('<user_a_workspace_id>', 'Task A3', 'in_progress', 'low', 'high', '<user_a_id>', 2);

-- Als User B einloggen, selbes Schema:
INSERT INTO tasks (workspace_id, title, status, priority, energy, created_by, position)
VALUES
  ('<user_b_workspace_id>', 'Task B1', 'todo', 'high', 'medium', '<user_b_id>', 0),
  ('<user_b_workspace_id>', 'Task B2', 'done', 'medium', 'low', '<user_b_id>', 1),
  ('<user_b_workspace_id>', 'Task B3', 'todo', 'low', 'high', '<user_b_id>', 2);
```

### Procedure

1. Als **User A** einloggen → Sync abwarten (5–10 Sekunden)
2. Console:
   ```javascript
   const r = await window.__powersync__.execute('SELECT id, title FROM tasks');
   console.table(r.rows._array);
   ```
3. Erwarte: genau 3 Rows mit Titeln `Task A1`, `Task A2`, `Task A3`
4. Ausloggen, als **User B** einloggen → Sync abwarten
5. Selbe Abfrage → genau 3 Rows mit Titeln `Task B1`, `Task B2`, `Task B3`

### Kriterium

| Check                                   | Erwartet       | Tatsächlich | Status  |
| --------------------------------------- | -------------- | ----------- | ------- |
| Sync: A bekommt nur eigene Solo-Tasks   | 3 (A1, A2, A3) | 3           | ✅ PASS |
| Sync: A bekommt KEINE B-Solo-Tasks      | 0              | 0           | ✅ PASS |
| Sync: B bekommt nur eigene Solo-Tasks   | 3 (B1, B2, B3) | 3           | ✅ PASS |
| Sync: B bekommt KEINE A-Solo-Tasks      | 0              | 0           | ✅ PASS |
| RLS: B-Direktzugriff sieht A-Solo-Tasks | 0              | 0           | ✅ PASS |

**Ergebnis:** ✅ **PASS** (Server-seitig verifiziert 2026-06-06)

**Notizen:** Bucket-Parameter `IN user_workspaces` isoliert sauber. Kein Cross-Workspace-Leak
weder im Sync-Pfad noch via direktem REST.

---

## Test 2: Duo Workspace — Private Data Isolation

**Ziel:** In einem gemeinsamen Workspace sind Tasks für beide sichtbar, Journal-Einträge nur für den jeweiligen Autor.

### Setup

1. User A erstellt ein **Duo-Workspace** (oder konvertiert das Solo-Workspace)
2. User A lädt User B ein (`workspace_invites`)
3. User B nimmt die Einladung an (wird `workspace_member`)
4. User A erstellt:
   - 1 Task: `title = "Shared Task A"` (workspace-scoped → beide sehen es)
   - 1 Journal-Eintrag: `body = "Privates Journal A"`
5. User B erstellt:
   - 1 Task: `title = "Shared Task B"`
   - 1 Journal-Eintrag: `body = "Privates Journal B"`

### Procedure

**Als User A:**

```javascript
const tasks = await window.__powersync__.execute('SELECT title FROM tasks');
const journal = await window.__powersync__.execute('SELECT body FROM journal_entries');
console.log('Tasks:', tasks.rows._array);
console.log('Journal:', journal.rows._array);
```

**Als User B (selbes Duo-Workspace):**

```javascript
const tasks = await window.__powersync__.execute('SELECT title FROM tasks');
const journal = await window.__powersync__.execute('SELECT body FROM journal_entries');
console.log('Tasks:', tasks.rows._array);
console.log('Journal:', journal.rows._array);
```

### Kriterium

| Check                         | User A             | User B             | Status  |
| ----------------------------- | ------------------ | ------------------ | ------- |
| Sync: Shared-Tasks sichtbar   | beide (Shared A+B) | beide (Shared A+B) | ✅ PASS |
| Sync: journal_entries         | nur eigener (1)    | nur eigener (1)    | ✅ PASS |
| Sync: journal kein Fremd-Leak | 0 Fremde           | 0 Fremde           | ✅ PASS |
| Sync: morning_rituals         | nur eigene (1)     | nur eigene (1)     | ✅ PASS |
| RLS: B sieht A-Journal direkt | —                  | 0                  | ✅ PASS |

**Ergebnis:** ✅ **PASS** (Server-seitig verifiziert 2026-06-06)

**Notizen:** `user_private`-Stream filtert konsequent über `user_id = auth.user_id()`.
Shared-Daten (`workspace_shared`) für beide Partner sichtbar, private Reflexionsdaten strikt isoliert.
RLS-Policy `journal_entries: own only` (`user_id = auth.uid()`) greift auch bei direktem Zugriff.

---

## Test 3: Offline Conflict Resolution (Last-Write-Wins)

**Ziel:** Zwei Offline-Edits auf denselben Task konvergieren zu einem stabilen Zustand. Der Spätere (nach `updated_at`) gewinnt.

### Setup

- User A auf zwei Browser-Tabs (oder zwei Geräten) eingeloggt
- Task T1: `title = "Original"`, beide Tabs vollständig synchronisiert

### Procedure

1. **Tab 1** offline schalten (DevTools → Network → Offline)
2. **Tab 2** offline schalten
3. Tab 1: T1 via Supabase direkt updaten:
   ```javascript
   // Simuliert lokalen Write (wird gequeued):
   await window.__powersync__.execute(
     "UPDATE tasks SET title = 'Edit von Tab 1', updated_at = datetime('now') WHERE id = ?",
     ['<task_t1_id>']
   );
   ```
4. 2 Sekunden warten (damit Tab 2 ein späteres `updated_at` hat)
5. Tab 2: T1 updaten:
   ```javascript
   await window.__powersync__.execute(
     "UPDATE tasks SET title = 'Edit von Tab 2', updated_at = datetime('now') WHERE id = ?",
     ['<task_t1_id>']
   );
   ```
6. **Tab 1** wieder online → Upload abwarten
7. **Tab 2** wieder online → Upload abwarten
8. Nach Sync: T1 title prüfen — sollte `"Edit von Tab 2"` sein

### Kriterium

| Check                             | Erwartet         | Tatsächlich | Status |
| --------------------------------- | ---------------- | ----------- | ------ |
| Kein Crash / Exception            | —                |             |        |
| Finaler Titel                     | "Edit von Tab 2" |             |        |
| Beide Tabs nach Re-Sync identisch | ja               |             |        |

**Edge Case dokumentiert:** Bei identischem `updated_at` entscheidet PowerSync per Server-Insertion-Order (nicht deterministisch — kein Fix nötig, nur dokumentieren).

**Ergebnis:** ⬜ PASS / ⬜ FAIL — ⏳ **CLIENT-SEITIG, im Browser auszuführen** (PowerSync-Local-Verhalten, nicht server-seitig simulierbar)

**Notizen:** Erfordert zwei Browser-Tabs als User A, Offline-Toggle und PowerSync-Write-Queue.
Hinweis: In Phase 09 ist `uploadData` noch ein No-op (Write-back erst Phase 10) — der Upload-Teil
dieses Tests greift erst, sobald Phase 10 die CRUD-Rückschreibung implementiert hat.

---

## Test 4: Logout Data Wipe

**Ziel:** Nach Logout sind null Zeilen in allen lokalen SQLite-Tabellen — kein staler Datensatz bleibt zurück.

### Setup

- User A eingeloggt, Workspace vollständig synchronisiert
- Mindestens 10+ Rows in verschiedenen Tabellen

### Procedure

**Vor Logout — Baseline erfassen:**

```javascript
const counts = await Promise.all([
  window.__powersync__.execute('SELECT COUNT(*) as n FROM tasks'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM journal_entries'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM workspaces'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM profiles'),
]);
console.log(
  'Pre-logout counts:',
  counts.map((r) => r.rows._array[0].n)
);
```

**Logout triggern** (Abmelden-Button oder via Console):

```javascript
// supabase ist im window-Scope nicht verfügbar — nutze den Abmelden-Button in der App.
// PowerSyncProvider ruft dann automatisch db.disconnectAndClear() auf.
```

**Nach Logout — sofort prüfen:**

```javascript
const counts = await Promise.all([
  window.__powersync__.execute('SELECT COUNT(*) as n FROM tasks'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM journal_entries'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM workspaces'),
  window.__powersync__.execute('SELECT COUNT(*) as n FROM profiles'),
]);
console.log(
  'Post-logout counts:',
  counts.map((r) => r.rows._array[0].n)
);
// Alle Werte müssen 0 sein
```

**Tab neu laden** (F5) → ohne Login erneut prüfen:

```javascript
// Zeigt "Not authenticated" UI — kein alter Datensatz sichtbar
```

### Kriterium

| Check                                     | Erwartet | Tatsächlich | Status |
| ----------------------------------------- | -------- | ----------- | ------ |
| tasks nach Logout                         | 0        |             |        |
| journal_entries nach Logout               | 0        |             |        |
| workspaces nach Logout                    | 0        |             |        |
| profiles nach Logout                      | 0        |             |        |
| Nach Tab-Reload: "Nicht eingeloggt"-State | ja       |             |        |

**Ergebnis:** ⬜ PASS / ⬜ FAIL — ⏳ **CLIENT-SEITIG, im Browser auszuführen** (lokale SQLite-Wipe, nicht server-seitig simulierbar)

**Notizen:** Code-Pfad existiert: `PowerSyncProvider` ruft im `SIGNED_OUT`-Handler
`disconnectAndClear()` auf (vgl. Commit 59285a2 „logout data wipe fix"). Verifikation erfordert
echten Browser: einloggen, Daten synchen, Abmelden-Button, Local-SQLite-Count = 0, dann Tab-Reload.

---

## Test 5: Finance Visibility Split (Duo Workspace)

**Ziel:** Private Finanzkonten sind für Partner B unsichtbar — weder via Sync noch via direktem API-Aufruf.

### Setup

- Duo-Workspace aus Test 2 (User A + User B)
- User A erstellt zwei Konten (via Supabase Dashboard → SQL oder App wenn UI vorhanden):
  ```sql
  INSERT INTO financial_accounts (workspace_id, owner_id, visibility, type, scope, name, currency)
  VALUES
    ('<workspace_id>', '<user_a_id>', 'private', 'checking', 'personal', 'Geheimes Konto', 'EUR'),
    ('<workspace_id>', '<user_a_id>', 'shared',  'checking', 'business', 'Gemeinsames Konto', 'EUR');
  ```
- User A erstellt je eine Transaktion pro Konto:
  ```sql
  INSERT INTO financial_transactions (account_id, transaction_date, amount, currency, description)
  VALUES
    ('<private_account_id>', '2026-06-06', -100, 'EUR', 'Private Transaktion'),
    ('<shared_account_id>',  '2026-06-06', -200, 'EUR', 'Gemeinsame Transaktion');
  ```

### Procedure

**Als User B einloggen — Sync abwarten:**

```javascript
const accounts = await window.__powersync__.execute(
  'SELECT name, visibility FROM financial_accounts'
);
const txns = await window.__powersync__.execute('SELECT COUNT(*) as n FROM financial_transactions');
console.log('Accounts:', accounts.rows._array);
console.log('Transactions:', txns.rows._array[0].n);
```

**Direkter INSERT-Angriff auf privates Konto (via Supabase JS als User B):**

```javascript
const { error } = await supabase.from('financial_transactions').insert({
  account_id: '<private_account_id_from_user_a>',
  transaction_date: '2026-06-06',
  amount: -50,
  currency: 'EUR',
  description: 'Angriff',
});
console.log('RLS Error (erwartet):', error?.code); // erwartet: '42501' oder 'PGRST301'
```

### Kriterium

| Check                                 | Erwartet                    | Tatsächlich     | Status  |
| ------------------------------------- | --------------------------- | --------------- | ------- |
| Sync: `financial_accounts` bei User B | 1 Row ("Gemeinsames Konto") | 1               | ✅ PASS |
| Sync: "Geheimes Konto" sichtbar       | NEIN                        | 0               | ✅ PASS |
| Sync: `financial_transactions` Count  | 1 (nur shared)              | 1               | ✅ PASS |
| RLS: B sieht "Geheimes Konto" direkt  | 0                           | 0               | ✅ PASS |
| RLS: INSERT auf privates Konto (B)    | RLS-Fehler (42501)          | blocked (42501) | ✅ PASS |

**Ergebnis:** ✅ **PASS** (Server-seitig verifiziert 2026-06-06)

**Notizen:** Finance-Split korrekt — privat sichtbares Konto bleibt im `user_private`-Stream
(nur Owner), shared im `workspace_shared`. Der direkte INSERT-Angriff von User B auf das private
Konto von User A wurde von der RLS-`WITH CHECK`-Policy (`financial_transactions: insert`,
`account.owner_id = auth.uid()`) mit SQLSTATE `42501` (insufficient_privilege) abgewiesen.

---

## Gesamtergebnis

| Test                          | Status                            | Datum      |
| ----------------------------- | --------------------------------- | ---------- |
| Test 1: Bucket Isolation      | ✅ PASS (server-seitig)           | 2026-06-06 |
| Test 2: Duo Private Isolation | ✅ PASS (server-seitig)           | 2026-06-06 |
| Test 3: Offline LWW           | ⏳ offen (client-seitig, Browser) | —          |
| Test 4: Logout Wipe           | ⏳ offen (client-seitig, Browser) | —          |
| Test 5: Finance Visibility    | ✅ PASS (server-seitig)           | 2026-06-06 |

**Server-seitige Sicherheitsgrenze (Sync Rules + RLS): alle 3 prüfbaren Tests PASS.**
Tests 3 & 4 prüfen reines Client-Verhalten und sind im Browser nachzuholen.

**Alle 5 PASS → Phase 10 freigegeben.**  
**Jeder FAIL → STOP — Sync Rules oder RLS debuggen.**

---

## Befund: RLS-Helper-Permissions (entdeckt 2026-06-06)

**Schweregrad:** mittel — **kein Daten-Leak**, aber blockierender Funktions-Bug ab Phase 10.

**Beobachtung:** Migration `0005_revoke_helper_functions.sql` entzieht `EXECUTE` auf
`public.is_workspace_member(uuid)` und `is_workspace_owner(uuid)` von `anon` + `authenticated`.
Live-Grants bestehen nur noch für `postgres` + `service_role`.

**Konsequenz:** **25 Tabellen** haben RLS-Policies, die diese Helper aufrufen (tasks, areas,
visions, goals, projects, financial_accounts, …). Ein direkter Zugriff der `authenticated`-Rolle
auf diese Tabellen scheitert daher nicht mit sauberer Zeilenfilterung, sondern mit
`ERROR: 42501: permission denied for function is_workspace_member`. Empirisch bestätigt:
`SET ROLE authenticated; SELECT count(*) FROM tasks;` → Fehler.

**Sicherheitsbewertung:** Aktuell **fail-closed** → kein Leak. In Phase 09 unkritisch, weil
`uploadData` ein No-op ist und Reads ausschließlich über PowerSync (`powersync_role`, BYPASSRLS)
laufen.

**Risiko ab Phase 10:** Sobald Write-back über den Standard-PowerSync-Supabase-Connector
(supabase-js mit User-Session = `authenticated`) implementiert wird, schlagen **alle** INSERT/
UPDATE/DELETE auf diese 25 Tabellen mit „permission denied for function" fehl.

**Fix-Optionen (vor Phase 10 zu entscheiden):**

1. **`GRANT EXECUTE … TO authenticated` wiederherstellen** (empfohlen): Die Helper sind
   `SECURITY DEFINER`, geben nur einen Boolean über die _eigene_ Mitgliedschaft des Aufrufers
   zurück und leaken nichts — Migration 0005 hat hier überkorrigiert. Der ursprüngliche
   REST-RPC-Missbrauch-Vektor ist vernachlässigbar.
2. Alle Writes über `service_role` / Edge-Function-RPC routen (deutlich aufwändiger).

> Für die RLS-Verifikation oben wurde `EXECUTE` **temporär** gewährt und unmittelbar wieder
> entzogen (Original-Zustand exakt wiederhergestellt).

---

## Debug-Hinweise

### PowerSync Sync-Status prüfen

```javascript
// In der Browser Console (app muss eingeloggt sein):
const status = window.__powersync__?.currentStatus;
console.log(status);
// connected: true, dataFlowStatus.uploading/downloading
```

### Sync Rules validieren

PowerSync Dashboard → deine Instanz → "Sync Rules" → "Validate" — zeigt Parsing-Fehler sofort.

### RLS simulieren (Supabase Studio)

```sql
-- Als User B's ID impersonieren:
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "<user_b_id>"}';

SELECT * FROM financial_accounts;
-- Darf nur shared accounts zeigen
```
