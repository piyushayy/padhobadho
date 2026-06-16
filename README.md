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
<img width="1912" height="737" alt="image" src="https://github.com/user-attachments/assets/dbc4c770-03cb-48c3-8783-32c926fe13c5" />
<img width="1893" height="718" alt="image" src="https://github.com/user-attachments/assets/a4e816f1-7e46-4390-a01d-9339b3c37c2c" />
<img width="1891" height="845" alt="image" src="https://github.com/user-attachments/assets/111ebdc9-afa5-4ca2-9681-ae378bdbd57a" />
<img width="1902" height="835" alt="image" src="https://github.com/user-attachments/assets/f541ed58-a727-4dae-bea8-058b7ca9d08e" />

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

src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── lib/          # Prisma client, auth config, utilities
prisma/
└── schema.prisma # Database schema
---

## Roadmap

- [ ] Mock test series with timer
- [ ] Detailed performance analytics
- [ ] Subject-wise weak area detection
- [ ] Leaderboard among friends
- [ ] Mobile app (React Native)

---

## Author

**Piyush** — MCA Student  
[GitHub](https://github.com/piyushayy) · [padhobadho.in](https://www.padhobadho.in)
