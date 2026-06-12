# ADR 0008 — PowerSync for Offline-First Sync (with Vendor Risk Analysis)

**Status:** Accepted
**Date:** 2026-05-03
**Last reviewed:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

Offline-first is a hard requirement: app must work fully offline and sync at next online opportunity. The naive approach (Supabase client + reactive cache) does not survive offline. We need a sync engine that:

1. Mirrors Postgres tables to local SQLite on every client
2. Queues writes when offline
3. Reconciles on reconnect with conflict resolution
4. Streams real-time changes between user's devices (Duo workspace)
5. Respects RLS and per-user data partitioning

## Decision

**Apex uses PowerSync (powersync.com) as the sync engine between Supabase Postgres and local SQLite on every client.**

Supabase remains the source of truth. PowerSync is the bridge layer.

**This is a deliberate vendor bet with documented exit strategy.** See "Vendor Risk" section below.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Device                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Apex App (Expo)                                    │   │
│   │   • UI reads from local SQLite (always available)   │   │
│   │   • UI writes to local SQLite (instant feedback)    │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │           ▲                          │
│              writes go│           │ changes pushed back      │
│                       ▼           │                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  PowerSync Client SDK                               │   │
│   │   • SQLite (op-sqlite, native)                      │   │
│   │   • Write queue (persistent across restarts)        │   │
│   │   • Sync engine (background)                        │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │           ▲                          │
└───────────────────────┼───────────┼──────────────────────────┘
                        │           │
                        │ when online: bidirectional sync
                        ▼           │
            ┌────────────────────────────┐
            │  PowerSync Service (EU)    │
            │   • Watches Postgres WAL   │
            │   • Streams changes by     │
            │     "buckets" (workspace)  │
            │   • Verifies auth via JWT  │
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  Supabase Postgres (EU)    │
            │   • Source of truth        │
            │   • RLS policies           │
            │   • Direct writes from     │
            │     PowerSync service      │
            └────────────────────────────┘
```

## How It Works

### Initial Setup

1. User signs in (Supabase Auth)
2. JWT token passed to PowerSync client
3. PowerSync queries which "buckets" the user has access to
4. Buckets are defined by sync rules (YAML) — typically per-workspace
5. PowerSync downloads relevant rows to local SQLite
6. App reads from local SQLite from this point forward

### Writes (Online)

1. User taps "Complete task"
2. App writes to local SQLite (UI updates instantly, ~5ms)
3. PowerSync writes to its local write queue
4. Queue flushes to PowerSync Service (~50ms)
5. PowerSync Service writes to Postgres (RLS enforced via authenticated user role)
6. Postgres triggers WAL change → PowerSync notices → broadcasts to other devices
7. Other devices update their SQLite within ~200ms

### Writes (Offline)

1. User taps "Complete task" in airplane mode
2. App writes to local SQLite (UI updates instantly)
3. Write queued in persistent queue (survives app restart)
4. App continues to function fully offline
5. When connection returns, queue flushes in order
6. Conflicts resolved per sync rules (default: last-write-wins by `updated_at`)

### Real-Time Across Devices

When User A writes from phone, User A's laptop sees the change within ~200ms. Same mechanism for Duo workspace: when Partner A creates a task, Partner B sees it within ~200ms.

This is what Supabase Realtime would provide for online-only apps. PowerSync is the offline-capable equivalent.

## Conflict Resolution

**Stage 1-2 strategy: Last-Write-Wins by `updated_at` column.**

Every synced table has:

```sql
updated_at timestamptz NOT NULL DEFAULT now()
```

Plus auto-update trigger:

```sql
CREATE TRIGGER set_updated_at_<table>
  BEFORE UPDATE ON <table>
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

For >95% of cases this is correct (single user editing their own data).

**Edge case:** Duo partner A and B simultaneously edit the same task description offline. Whoever syncs second wins.

**Stage 3 upgrade path (if user feedback demands):** Migrate problematic fields to CRDT-based merging (Yjs). Discrete fields stay LWW.

---

## Vendor Risk Analysis (Honest)

This is the most important section. PowerSync is a young company. Decision to use it carries risk we must understand.

### Risk Profile

**PowerSync the company:**

- Founded 2023 by JourneyApps team (existing offline-first product since 2009 → mature engineering)
- Series A funded ($7.6M raised through 2025, sources may be outdated)
- ~30 employees as of late 2025
- Open-source clients (MIT licensed); managed service (proprietary)
- Self-hostable via Docker (open-source service available since 2024)

**Risk levels:**

- **Risk of company dying within 2 years:** Low-moderate. Funded, growing, but startup.
- **Risk of pricing changes that hurt us:** Moderate. SaaS startups commonly raise prices at growth stage.
- **Risk of product direction change away from our use case:** Low. Postgres+SQLite is core product.
- **Risk of acquisition (good or bad):** Moderate. Could be acquired by Supabase, Vercel, or similar; or by a larger DB company.

### Why We Accept This Risk

1. **Build vs. buy math.** Rolling our own sync engine = 2-3 months solo founder time. PowerSync = €0-49/mo. Even if PowerSync dies in 2 years, we got 24 months of building features instead of plumbing.

2. **Open-source SDKs.** PowerSync's client SDKs are MIT-licensed. If the company dies tomorrow, our app still works with existing builds. We just can't get new features or bug fixes.

3. **Self-hosting is a real Plan B.** PowerSync Service is open-source (Apache 2.0). If pricing becomes untenable, we self-host on a VPS for ~€20/mo + ops time.

4. **Postgres-centric design.** PowerSync is essentially a Postgres-to-SQLite-replication tool. The data is always in our Postgres. If we migrate away, we don't lose data — we just lose the sync layer.

### Migration Strategy (If We Have to Leave PowerSync)

This is the real safety net. If PowerSync becomes unviable, here's our exit:

**Option A: Self-host PowerSync Service** (lowest cost, lowest risk)

- Deploy open-source PowerSync Service on Hetzner/Railway/Fly.io VPS
- Estimated migration time: 1-2 weeks (DevOps + testing)
- Estimated ongoing cost: €20-40/mo VPS + 2-4 hours/month maintenance
- App code unchanged (same SDK)
- This is the most likely fallback

**Option B: Migrate to Replicache** (medium effort, mature alternative)

- Replicache (replicache.dev) is the most mature alternative
- Has different mental model (custom mutators) but solves same problem
- Estimated migration time: 4-6 weeks (rewrite sync layer + testing)
- App business logic mostly unchanged (only data hooks rewrite)

**Option C: Migrate to Legend State + custom sync** (highest effort, lowest dependency)

- Legend State 3 + custom sync via Supabase Realtime + IndexedDB
- Self-built conflict resolution
- Estimated migration time: 8-12 weeks (significant rewrite)
- Lowest vendor dependency but highest engineering cost
- Only chosen if Options A and B fail

**Option D: Drop offline-first entirely**

- If migration is impossible and PowerSync dies, fall back to online-only via Supabase Realtime
- Estimated migration: 2-3 weeks (remove sync layer, add online-only loading states)
- Functional regression but app survives
- Not preferred but possible

### What Triggers Migration

We migrate away from PowerSync if any of these occur:

- **Pricing change** that more than doubles our cost projection without proportional value
- **PowerSync sunsets self-hostable version** (locks us into managed service)
- **Multiple sustained outages** (>1% downtime monthly) for 3+ consecutive months
- **PowerSync acquired by competitor** that signals end-of-life for managed service
- **PowerSync abandons Postgres direct integration** (unlikely but possible)
- **Company shuts down** (we monitor this monthly via funding news, GitHub activity, customer reviews)

### Monitoring We Do

- Monthly check: PowerSync GitHub commit frequency, recent releases, status page uptime
- Quarterly check: PowerSync pricing page, blog announcements, funding news
- Tracked in `docs/vendor-monitoring.md` (Phase 1 task to create)

---

## Why Not Alternatives (Reconfirmed)

### Why not Supabase Realtime alone?

Streams when online, but no local persistence, no offline write queueing, no reconnection conflict resolution, no initial bulk hydration. Building these = rebuilding PowerSync from scratch.

### Why not WatermelonDB?

Local DB + sync framework. **Sync layer is BYO.** Same problem as Realtime — we'd write the engine.

### Why not Replicache?

Excellent product, **kept as Plan B**. More mental model overhead (custom mutators). Higher pricing tier ($299/mo Starter vs. PowerSync's $49/mo). PowerSync's direct Postgres mirroring fits Apex's data model better for now.

### Why not RxDB?

Solid client-side DB with replication adapters. GraphQL/REST adapters require more glue code than PowerSync's Postgres-native approach. **Plan C** if both PowerSync and Replicache fail.

### Why not Convex?

Excellent for real-time apps but **replaces Postgres**. We've already chosen Postgres + Supabase + RLS. Switching backends now = bigger commitment than picking sync engine.

### Why not roll our own from day 1?

Sync engines are the kind of thing where "roll your own" looks easy on day 1 and is hellish by month 6. Edge cases (network blips, partial syncs, clock skew, schema migrations during offline, retry storms) eat months. PowerSync's $0-49/mo is dramatically cheaper than 2 months of founder time.

---

## Pricing (Verify Before Phase 1)

**Important:** PowerSync pricing may have changed. Verify at https://www.powersync.com/pricing before locking in.

PowerSync pricing (estimate as of 2025, verify before commitment):

| Tier         | Estimated Price | Limits                              | Apex Stage        |
| ------------ | --------------- | ----------------------------------- | ----------------- |
| Free / Hobby | $0              | 1 instance, limited MAU, limited GB | Stage 1 (Alpha)   |
| Starter      | ~$49/mo         | More MAU, more GB                   | Stage 2 (Beta)    |
| Pro          | ~$199/mo        | High MAU, more features             | Stage 3 (Launch+) |

Free tier should cover Stage 1 (founder + ~50 alpha users). Starter tier ~$49/mo is well under SaaS revenue at 100 paying users (€1,200/mo MRR at €12/mo Solo Pro).

If pricing has materially changed before Phase 1, we re-evaluate this ADR.

---

## Trade-Offs

### Positive

- Offline-first works on day 1 of Phase 1
- Sync between devices works on day 1
- Don't write a sync engine
- EU-hosted (DSGVO compliant)
- Open-source client SDKs (vendor risk capped)
- Self-hostable Plan B available

### Negative

- Vendor dependency on PowerSync (mitigated above)
- Sync rules YAML is a new concept to learn
- Local SQLite on web is via WASM; works but slightly slower than native SQLite on mobile
- PowerSync respects RLS via authenticated tokens, but bucket rules are the real security boundary — needs careful testing (see below)

### Critical Security Note

**PowerSync's Service authenticates to Postgres with elevated privileges.** Sync Rules (YAML) are the security boundary, not RLS alone. A misconfigured bucket rule can leak data between workspaces.

**Mandatory in Phase 9-10:**

- Explicit bucket rule tests (User A cannot see Workspace B data via PowerSync)
- Code review checklist for any sync rule change
- Defense-in-depth: RLS still enforced for any direct API access (server actions, RPC calls)

This is documented in `data-model.md` PowerSync section.

## What Triggers Revisiting

- PowerSync makes major pricing changes
- PowerSync deprecates Postgres direct integration (would require migration)
- Apex grows to scale where self-hosting is materially cheaper
- A new entrant (yet to exist) significantly outclasses PowerSync

## References

- [PowerSync docs](https://docs.powersync.com/)
- [PowerSync Supabase integration guide](https://docs.powersync.com/integration-guides/supabase-+-powersync)
- [PowerSync open-source service repo](https://github.com/powersync-ja/powersync-service)
- [Replicache (Plan B)](https://replicache.dev/)
- [RxDB (Plan C)](https://rxdb.info/)
- [Local-First Manifesto (Ink & Switch)](https://www.inkandswitch.com/local-first/)
