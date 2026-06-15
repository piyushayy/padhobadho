PadhoBadho 📚

Adaptive CUET Preparation — Built for Students Who Want Results

Show Image
Show Image
Show Image
Show Image
Show Image

</div>

What is PadhoBadho?

PadhoBadho is a CUET prep platform that adapts to how you learn — not just what you study. It tracks your mistakes, adjusts difficulty based on your performance, and builds daily streaks to keep you consistent.

Built for students preparing for the Central University Entrance Test (CUET) who want more than static PDFs and YouTube playlists.


Padhega India. Badhega India.




Features


🔐 Auth — Google OAuth + Email/Password login via NextAuth.js
🎯 Adaptive Difficulty — Questions adjust based on your performance history
🔥 Streak & XP System — Daily goals, streaks, levels to keep you consistent
👤 Smart Onboarding — Stream selection, target university, exam preferences
🛡️ Role-Based Access — Separate flows for Students and Admins
📊 Performance Tracking — XP, levels, streaks, and last active date
📱 Fully Responsive — Works across mobile and desktop



Tech Stack

LayerTechnologyFrontendNext.js 14 (App Router), TypeScript, Tailwind CSSBackendNext.js API RoutesDatabasePostgreSQL via NeonORMPrismaAuthNextAuth.jsDeploymentVercel


Screenshots


Add screenshots here — drag images into the GitHub editor to auto-upload




Getting Started

Prerequisites


Node.js 18+
A PostgreSQL database (Neon recommended — free tier works)


1. Clone the repo

bashgit clone https://github.com/piyushayy/padhobadho.git
cd padhobadho
npm install

2. Set up environment variables

Create a .env file in the root directory:

env# Database
DATABASE_URL=your_neon_postgres_connection_string

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

3. Set up the database

bashnpx prisma generate
npx prisma db push

4. Run the development server

bashnpm run dev

Open http://localhost:3000 in your browser.


Project Structure

padhobadho/
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/     # Student dashboard
│   │   ├── admin/           # Admin panel (role-protected)
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   └── lib/                 # Prisma client, auth config, helpers
├── .env                     # Environment variables (never commit)
├── next.config.ts
└── tailwind.config.ts


Roadmap


 Mock test series with countdown timer
 Subject-wise weak area detection
 Detailed performance analytics dashboard
 Leaderboard among friends / college peers
 Push notifications for daily streaks
 Mobile app (React Native)



Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.


Fork the repo
Create a feature branch (git checkout -b feature/your-feature)
Commit your changes (git commit -m 'feat: add your feature')
Push to the branch (git push origin feature/your-feature)
Open a Pull Request



License

MIT — free to use, modify, and distribute.


<div align="center">
Built by Piyush · MCA Student · padhobadho.in

⭐ Star this repo if you find it useful

</div>
