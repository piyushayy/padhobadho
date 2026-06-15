import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

const googleId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

if (!googleId || !googleSecret) {
    console.warn("⚠️ Google Provider credentials missing. Check .env file.")
}

export default {
    providers: [
        Google({
            clientId: googleId,
            clientSecret: googleSecret,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                if (token.sub) {
                    session.user.id = token.sub
                }
                if (token.role) {
                    session.user.role = token.role as "ADMIN" | "STUDENT"
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const { pathname } = nextUrl

            // API and Public Routes
            const isApiAuthRoute = pathname.startsWith("/api/auth")
            const isPublicRoute = [
                "/",
                "/about",
                "/contact",
                "/privacy-policy",
                "/terms-and-conditions",
                "/auth/sign-in",
                "/auth/sign-up"
            ].includes(pathname)

            // Auth specific routes
            const isAuthRoute = [
                "/auth/sign-in",
                "/auth/sign-up",
                "/auth/forgot-password",
                "/auth/new-password",
                "/auth/verify"
            ].includes(pathname)

            const isAdminRoute = pathname.startsWith("/admin")

            // 1. Allow all API Auth routes
            if (isApiAuthRoute) return true

            // 2. Auth Routes (Sign In / Sign Up)
            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            // 3. Logic for non-logged in users
            if (!isLoggedIn) {
                // Allow public routes, redirect others to sign-in
                if (isPublicRoute || pathname === "/practice") return true
                return false
            }

            // 4. Admin Protection
            if (isAdminRoute && auth?.user?.role !== "ADMIN") {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }

            return true
        },
    },
} satisfies NextAuthConfig
