# Launch Readiness & User Availability Plan

## 1. Deployment & Infrastructure
- [x] **Database Connection:** Verified `DATABASE_URL` uses the correct Neon connection string.
- [x] **Build Verification:** `npm run build` passes locally.
- [ ] **Vercel Env Vars:** **CRITICAL:** You must update the `DATABASE_URL` in your Vercel project settings to match the one in your local `.env` file (the `neondb_owner` one).
- [ ] **Redeploy:** Trigger a new deployment on Vercel after updating the variable.

## 2. User Support & Feedback (Priority: High)
*Currently, if a user faces an issue, they have no way to report it.*
- [ ] **Feedback Widget:** Add a visible "Feedback" or "Help" button in the sidebar or as a floating action button.
- [ ] **Support Email:** Ensure a support email is visible on the landing page or footer.

## 3. Analytics & Monitoring
- [ ] **Vercel Analytics:** Enable this in the Vercel dashboard to see visitor counts and page views.
- [ ] **Vercel Speed Insights:** Enable to track performance (Core Web Vitals).

## 4. Legal & Trust
- [ ] **Privacy Policy:** content is present in `/privacy`.
- [ ] **Terms of Service:** Ensure `/terms` exists or is covered.

## 5. SEO & Discovery
- [x] **Sitemap:** `sitemap.ts` is configured.
- [ ] **Metadata:** Ensure `layout.tsx` has a descriptive `title` and `description` (Social OpenGraph tags).

## 6. Community & Growth
- [ ] **Invite System:** Simple "Share with friends" button.
- [ ] **Discord/Telegram:** Link to a community server if you have one.
