import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
            const isPublicRoute = ["/", "/about", "/contact", "/privacy-policy", "/terms-and-conditions"].includes(nextUrl.pathname)
            const isAuthRoute = ["/auth/sign-in", "/auth/sign-up"].includes(nextUrl.pathname)

            if (isApiAuthRoute) return true

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            if (!isLoggedIn && !isPublicRoute) {
                return false
            }

            return true
        },
    },
} satisfies NextAuthConfig
