# PadhoBadho 🇮🇳

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.65-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Padhega India, Badhega India.**  
*100% Free, High-Yield Exam Preparation Platform for Class 12 Boards, JEE, NEET, CUET, SSC & DSSSB.*

[**Explore Platform (Live)**](https://padhobadho.com) · [**Report Bug**](https://github.com/piyushayy/padhobadho/issues) · [**Request Feature**](https://github.com/piyushayy/padhobadho/issues)

</div>

---

## 🌟 Mission: 100% Free Forever

PadhoBadho is built on a single uncompromising premise: **high-quality competitive exam preparation should never be gated behind paywalls or subscription fees.** 

Every student gets full, unlimited access to:
- **No Paid Gimmicks**: Zero subscription paywalls, zero paid AI token charges, zero locked answer keys.
- **Official NTA CBT Mock Engine**: Realistic full-length mock tests with server-authoritative answer persistence and zero-loss crash recovery.
- **PYQ Vault**: Curated previous years question papers with step-by-step solutions and KaTeX mathematical formulas.
- **Target Exams**: Class 12 CBSE/State Boards, JEE Main, NEET-UG, CUET-UG, SSC CGL, and DSSSB.

---

## 🚀 Key Features

### ⚔️ 1v1 Battle Arena (`/battle`)
- Real-time 5-question rapid-fire sprints against peer aspirants across India.
- Dual live score progress bars, 15-second question timers, instant winner podiums, and +100 XP rewards.

### 🏆 Weekly Sunday Contest Arena (`/contest`)
- National scheduled mock exams every Sunday at 10:00 AM IST.
- Live countdown clock, identical question seeds, synchronized scoring, and All-India percentile leaderboards.

### 👥 Social & Viral Sharing
- **Friend Leaderboard (`/leaderboard?tab=friends`)**: Follow peers and track friends-only weekly XP rankings.
- **Dynamic Share Cards**: Instant scorecard generator formatted with score, accuracy, and rank with 1-click WhatsApp and native mobile Web Share.

### 📚 Course Delivery & KaTeX Lessons (`/courses`)
- Structured curriculum catalogs for Science, Commerce, and Humanities.
- Chapter and lesson breakdowns with math formulas and chemical equations powered by KaTeX:
  $$\Delta U = q + w, \quad v = u + at, \quad e_d = \frac{\% \Delta Q}{\% \Delta P}$$
- Interactive lesson reader with reading duration estimates, completion checkmarks, and +20 XP progress awards.

### 🔥 LeetCode-Style Habit Engine
- **Streak Freeze**: 1 free streak freeze per week to protect daily study streaks during emergencies.
- **Weekly Quests**: Dynamic 50-question weekly goals with real-time progress bars and bonus XP claims.
- **Activity Heatmap**: GitHub-style interactive yearly contribution calendar on user profiles.
- **Celebration Modals**: Canvas-confetti level-up celebrations and animated XP feedback toasts.

### 🎯 Testbook-Style Free Guest Funnel
- Instant 5-question guest trial on any subject without requiring registration.
- 1-tap Google OAuth integration across all modals and auth entry points.

---

## 📸 Screenshots

<div align="center">

<img width="900" alt="Landing Page" src="https://github.com/user-attachments/assets/dbc4c770-03cb-48c3-8783-32c926fe13c5" />

<img width="900" alt="Mock Test Engine" src="https://github.com/user-attachments/assets/a4e816f1-7e46-4390-a01d-9339b3c37c2c" />

<img width="900" alt="Practice Drills" src="https://github.com/user-attachments/assets/111ebdc9-afa5-4ca2-9681-ae378bdbd57a" />

<img width="900" alt="Dashboard" src="https://github.com/user-attachments/assets/f541ed58-a727-4dae-bea8-058b7ca9d08e" />

</div>

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS 3.4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Math & Theory** | [KaTeX](https://katex.org/), `remark-math`, `rehype-katex`, `react-markdown` |
| **Authentication** | [Auth.js / NextAuth v5](https://authjs.dev/) (Google OAuth + Email/Credentials) |
| **Database & ORM** | [Neon Serverless PostgreSQL](https://neon.tech/), [Prisma ORM 5.22](https://www.prisma.io/) |
| **Testing** | [Playwright](https://playwright.dev/) (Cross-browser E2E suite: Desktop & Mobile Chrome) |
| **CI/CD & Monitoring** | GitHub Actions (`.github/workflows/ci.yml`), Vercel Speed Insights, Web Vitals |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js `20.x` or higher
- PostgreSQL database (or free [Neon](https://neon.tech/) instance)

### 1. Clone & Install
```bash
git clone https://github.com/piyushayy/padhobadho.git
cd padhobadho
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Update `.env.local` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/padhobadho?sslmode=require"
AUTH_SECRET="your-32-character-secret-key-here"
NEXTAUTH_SECRET="your-32-character-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Gates

PadhoBadho enforces automated testing across all pull requests:

```bash
# Type checking
npx tsc --noEmit

# Production build verification
npm run build

# End-to-end tests (Playwright)
npx playwright test
```

---

## 📂 Project Structure

```
padhobadho/
├── .github/
│   ├── workflows/ci.yml       # Automated GitHub Actions build & test pipeline
│   └── ISSUE_TEMPLATE/        # Standardized bug & feature request templates
├── docs/                      # Architectural docs & migration guides
│   ├── BUILD_PLAN_GENZ.md     # 5-Phase strategic roadmap
│   └── DATABASE_MIGRATION_GUIDE.md # Zero-downtime database deployment guide
├── e2e/                       # Playwright end-to-end test specifications
├── prisma/
│   ├── schema.prisma          # Active production database schema
│   └── schema-proposal.prisma # Proposed model extensions
├── src/
│   ├── actions/               # Server Actions (battle, friends, lessons, practice, gamification)
│   ├── app/                   # Next.js 16 App Router pages
│   │   ├── battle/            # 1v1 rapid-fire sprint arena
│   │   ├── contest/           # Sunday national contest arena
│   │   ├── courses/           # Structured syllabus & KaTeX lesson player
│   │   ├── leaderboard/       # All-India & friends rankings
│   │   ├── mock-test/         # Server-authoritative CBT mock test engine
│   │   └── practice/          # Adaptive practice drills & guest trial
│   ├── components/            # Reusable UI components & providers
│   └── lib/                   # Prisma client, auth options, utilities
```

---

## 🤝 Contributing

Contributions are welcomed from developers and educators! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for Indian students by Piyush. Padhega India, Badhega India.</sub>
</div>
