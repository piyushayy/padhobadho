# PadhoBadho 📚

> CUET preparation platform built for focused, adaptive learning.

**Live at:** [padhobadho.in](https://www.padhobadho.in)

---

## What is PadhoBadho?

PadhoBadho is a CUET prep platform that adapts to how you learn — 
not just what you study. It tracks your mistakes, adjusts difficulty, 
and builds streaks to keep you consistent.

Built for students preparing for Central University Entrance Tests (CUET)
who want more than static PDFs and YouTube playlists.

---

## Features

- 🔐 Auth with Google + Email/Password (NextAuth)
- 📊 Adaptive difficulty based on performance
- 🔥 Streak tracking and XP system
- 👤 Onboarding flow with stream and target university selection
- 🛡️ Role-based access (Student / Admin)
- 📱 Responsive UI across devices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

```bash
git clone https://github.com/piyushayy/padhobadho.git
cd padhobadho
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL=your_neon_postgres_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run Locally

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure
