# Contributing to PadhoBadho 🇮🇳

Thank you for your interest in contributing to PadhoBadho! Our mission is **Padhega India, Badhega India** — providing 100% free, high-yield exam preparation for students across India without fees, paywalls, or paid tokens.

---

## 📜 Guiding Principles

1. **100% Free Forever**: We never add subscriptions, paywalls, paid tiers, or paid AI token gates. All mock tests, PYQ vaults, practice questions, and lessons remain freely accessible to every student.
2. **Minimal Code, Maximum Impact**: We value clean, idiomatic code over unnecessary abstractions. Follow the rules in `AGENTS.md`.
3. **Zero Downtime**: Database changes are drafted in `prisma/schema-proposal.prisma` first, and application code must always provide resilient fallbacks for offline or cached states.

---

## 🛠️ Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/<your-username>/padhobadho.git
   cd padhobadho
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and provide your database credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Before submitting any Pull Request, ensure all quality gates pass:

```bash
# 1. Type Check
npx tsc --noEmit

# 2. Production Build
npm run build

# 3. Playwright End-to-End Tests
npx playwright test
```

---

## 🔀 Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature-name`.
2. Follow conventional commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
3. Push to your fork and submit a PR referencing any relevant issue.
