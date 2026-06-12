# ADR 0002 — Solo and Duo Personas Only

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

The original Master Prompt targeted four personas: founders/creators/freelancers (Solo), teams, families, students. After product strategy review, this was identified as a positioning trap that historically kills solo-founded SaaS products.

## Decision

**Apex serves two personas: Solo Operator and Duo.** Families and Students are explicitly excluded. Teams (3+) is excluded from Stage 1 and Stage 2; reconsidered for Stage 3 only with clear evidence of demand and resources.

## Rationale

Each persona has fundamentally different jobs-to-be-done:

| Persona       | Core Need                               | Tools That Win                 | Why Apex Fits or Doesn't                                              |
| ------------- | --------------------------------------- | ------------------------------ | --------------------------------------------------------------------- |
| Solo Operator | Vision-to-Execution alignment           | Notion (lose), Sunsama, Things | **Fits perfectly.** Identity, deep work, OBT, score card.             |
| Duo           | Shared vision + accountability          | Nothing premium exists         | **Fits perfectly.** Same data model as Solo + workspace_members.      |
| Team 3+       | Resource allocation, permissions, audit | Linear, Asana, Monday          | **Doesn't fit.** Different infrastructure (RBAC, SSO, audit logs).    |
| Family        | Chores, schedules, kids                 | Cozi, OurHome                  | **Doesn't fit.** Goals/visions/deep work irrelevant.                  |
| Students      | Class schedules, exams, study groups    | Notion, MyStudyLife            | **Doesn't fit.** Lower willingness-to-pay, different jobs-to-be-done. |

**Notion lesson:** Notion attempted all five personas simultaneously starting 2016. Took $343M funding and 8 years to find positioning. Apex cannot afford that.

**Linear lesson:** Linear deliberately excluded teams under 5 and over 200 in early years. The narrow positioning enabled rapid iteration and clear messaging. Reached $400M valuation with this constraint.

## Implications

### Marketing

- Landing page speaks to two personas only: "For Solo Operators and Duos."
- Two case studies maximum. Two pricing tiers maximum (plus Free).
- Saying "no" to non-fit prospects is part of brand authenticity.

### Product

- **Workspace concept** in data model from day 1 (supports Duo natively, can support Team later if reconsidered).
- **Permission model** is binary: workspace member or not. No RBAC complexity in Stage 1-2.
- **No team-only features** built (audit logs scoped to workspace, no SSO, no role hierarchies).
- **No family-only features** built (no shared grocery, no chores-for-kids, no parental controls).
- **No student-only features** built (no class schedules, no academic calendar).

### Pricing

- Three tiers: Free, Solo Pro, Duo Pro. No Team tier.
- Free is a trial, not a permanent home.

### Code Architecture

- Workspace is first-class in data model (`workspaces` table, `workspace_members` join, `workspace_id` on all entities).
- RLS policies enforce workspace boundaries.
- Switching workspaces in app is a UI affordance (top-left workspace switcher), not a multi-account context.

## Consequences

### Positive

- **Clearer messaging.** "Built for solo founders and pairs who refuse 8 apps."
- **Simpler product decisions.** Every feature request filtered by "does this serve Solo or Duo?"
- **Faster iteration.** Two personas to validate, not five.
- **Higher pricing power.** Premium tools for premium personas. €12-29/mo viable.
- **Shorter time to PMF.** Validation possible with 50 users, not 500.

### Negative

- **Smaller TAM.** Excluded personas reduce theoretical market by 60-70%.
- **Refusing prospects.** Some interested users will be told "Apex isn't for you." Some will feel rejected.
- **No team-deal revenue.** Higher-ARPU enterprise contracts ruled out.

### Neutral

- **Future expansion possible.** Workspace data model supports Team later if Stage 3 evidence justifies it. No technical lock-in.

## What Triggers Revisiting

- After Stage 2 with 100+ paying users, examine: do Solo users keep inviting their full teams (suggesting Team demand)?
- If Duo workspace usage is <10% of Pro accounts, Duo persona may be wrong (revisit positioning, not necessarily expand).
- If Solo users churn citing "needs team features," gather data — but resist expanding scope under feature pressure alone.

## What Does NOT Trigger Revisiting

- Inbound requests from teams of 3-10 saying "we'd buy if you supported us"
- Marketing voices suggesting "you're leaving money on the table"
- Comparison to Linear, Notion, ClickUp pricing

These are the standard noise that kills focused products. Documented here to prevent decision drift.

## References

- [Notion's path to PMF (8 years, multi-persona drift)](https://www.lennysnewsletter.com/p/notions-path-to-product-market-fit)
- [Linear's deliberate constraint as advantage](https://linear.app/method)
- [The 22 Immutable Laws of Marketing — Law of Focus (Ries & Trout)](https://en.wikipedia.org/wiki/The_22_Immutable_Laws_of_Marketing)
