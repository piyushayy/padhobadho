# Database Migration & Reliability Guide

This document establishes the zero-downtime database migration workflow for PadhoBadho as outlined in Phase E of `BUILD_PLAN_GENZ.md`.

---

## 1. Environment Separation

PadhoBadho maintains strict separation between environments:

| Environment | Database Target | Purpose |
| :--- | :--- | :--- |
| **Development** | Local Docker / Dev Neon Branch | Rapid testing, seeding, schema changes |
| **Staging / Preview** | Neon Preview Branch | PR verification, Playwright end-to-end tests |
| **Production** | Neon Serverless PostgreSQL | Live user traffic, zero-downtime schema deployments |

---

## 2. Zero-Downtime Migration Discipline

To ensure that the 100% free platform never experiences 500 errors during deployments:

### Step 1: Schema Proposal First
- All proposed models and relations are first added and reviewed in `prisma/schema-proposal.prisma`.
- Application code is designed with **backward-compatible fallbacks** (e.g., fallback cookies such as `pb_guest_attempts`, `pb_streak_freeze`, and `pb_lesson_progress`) so code deployed before migrations runs cleanly without exceptions.

### Step 2: Create Migration (Dev/Staging)
```bash
# In local or dev environment:
npx prisma migrate dev --name add_genz_features
```

### Step 3: Verify Backward Compatibility
- Ensure newly added columns have `@default(...)` values or are optional (`?`).
- Never drop columns in the same release where code stops referencing them; follow the **Expand and Contract** pattern:
  1. **Expand**: Add new optional column / table and deploy application code writing to both.
  2. **Migrate**: Backfill existing rows if necessary.
  3. **Contract**: Stop reading old column, then drop it in a subsequent migration.

### Step 4: Apply in Production
In production CI/CD or release scripts, use:
```bash
npx prisma migrate deploy
```
*(Never use `prisma db push` or `prisma migrate reset` in production!)*

---

## 3. Server-Authoritative Mock Tests
- During mock exams, student answers are written incrementally via `recordMockAnswer(sessionId, questionId, answerIndex)` and mirrored in `localStorage`.
- Even if internet connectivity drops or the tab refreshes, the session automatically rehydrates without data loss.
