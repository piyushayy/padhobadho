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
            if (token.role && session.user) {
                session.user.role = token.role as "ADMIN" | "STUDENT"
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
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
            const isPublicRoute = ["/", "/about", "/contact", "/privacy-policy", "/terms-and-conditions"].includes(nextUrl.pathname)
            const isAuthRoute = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password", "/auth/new-password", "/auth/verify"].includes(nextUrl.pathname)
            const isAdminRoute = nextUrl.pathname.startsWith("/admin")

            if (isApiAuthRoute) return true

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            if (!isLoggedIn) {
                if (isPublicRoute) return true
                return false
            }

            if (isAdminRoute && auth?.user?.role !== "ADMIN") {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }

            return true
        },
    },
} satisfies NextAuthConfig
