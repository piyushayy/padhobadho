# PadhoBadho — Gen-Z Build Plan (No Payments)

> **Rule for any agent reading this:** no payment/subscription code. Monetization is out of scope.
> Frequent smaller builds > one big build. Reuse what exists before writing anything new.

## 1. Access Model (Freemium, No Money)

| Tier | What they get | Gate |
|------|--------------|------|
| **Guest** (no login) | Practice: 5 free questions/session per subject, Resources vault (PDFs/notes), Leaderboard preview, Community read-only, Landing "try it" playground | Guest banner + "Sign up to continue" prompt at limits |
| **Logged-in** (free forever) | Unlimited practice, Mock tests, Daily challenge + streaks/XP, Analytics, Mistake bank, Achievements, Community posting, Leaderboard rank | `onboardingCompleted` check → onboarding flow |

Implementation rule: gate in **server actions** (`src/actions/*`), never just UI. Pattern:
guest attempts counted per user via existing `UserQuestionHistory` (userId = guest session id)
or a simple `guestAttempts` cookie counter — pick the cheapest that works.

## 2. Gen-Z Design Language

Apply globally in `globals.css` + components:

- **Bento-grid dashboard**, big rounded cards (rounded-3xl), soft shadows
- **One loud accent** (current purple/green palette is fine) + generous whitespace — "calm, not cluttered" per PRD
- **Micro-interactions everywhere**: framer-motion page transitions, confetti on streak milestones (canvas-confetti is installed), springy buttons
- **Copy with attitude**: "You cooked 🔥 12-day streak", "Ranked better than 78% of aspirants", short punchy microcopy, no corporate tone
- **Dark mode default option** (theme-toggle.tsx exists — polish it)
- **Shareable moments**: OG-image scorecards for mock results ("I scored 92% on CUET Quant — beat me")

## 3. Feature Phases

### Phase A — Tighten the guest funnel (small, do first)
1. Guest limit enforced server-side in practice action + upgrade prompt UI
2. Guest leaderboard preview (top 10 blurred rows below)
3. "Sign up with Google" one-tap on every gate prompt
4. Verify e2e `guest-practice-flow.spec.ts` still green

### Phase B — Habit engine polish (LeetCode loop)
1. Streak freeze (1 freeze/week, spend to protect streak)
2. Weekly quest card: "Solve 50 Qs this week" with progress bar → XP bonus
3. Level-up animation + XP toast rework
4. Daily challenge calendar heatmap (GitHub-style) on profile

### Phase C — Social & Gen-Z differentiators
1. **Battle mode**: 1v1 random 5-question sprint vs online user (ws is installed; or polling — start with polling, simpler)
2. **Friend leaderboard**: follow users, see friends-only ranking
3. **Share cards**: mock result → generated OG image → WhatsApp/Instagram share
4. Weekly Sunday "Contest Arena" (scheduled mock, everyone same questions, live rank)

### Phase D — Content & course delivery
1. Lessons: `Chapter`/`Lesson` models, markdown + KaTeX (md-editor already installed), lesson progress
2. Course page: progress bar, next-lesson CTA
3. Push content pipeline: keep using admin CSV bulk upload; target 1,000+ Qs per subject

### Phase E — Reliability (continuous)
1. Server-authoritative mock test (save each answer as submitted, not at end)
2. Sentry + Vercel Analytics/Speed Insights
3. `prisma migrate` discipline, separate dev/prod DBs
4. GitHub Actions: `next build` + Playwright on PR

## 4. Explicitly NOT building
- Payments, subscriptions, pricing pages, entitlement checks
- Video hosting / live class infrastructure
- React Native app (later; PWA via manifest.ts is already there)

## 5. Antigravity workflow
- Feed agent this file + `AGENTS.md` + `docs/PRD_2026_STRATEGY.md` as context
- One phase step per task; run `npm run build` + `npm run test:e2e` after each
- Schema changes: propose in `prisma/schema-proposal.prisma` first, review, then apply
