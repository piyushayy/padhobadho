import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        ...authConfig.providers,
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || !user.password) return null

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) return null

                return user
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (session.user) {
                if (token.sub) session.user.id = token.sub;
                if (token.role) session.user.role = token.role as "ADMIN" | "STUDENT";
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role
            }

            if (token.sub) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true }
                })
                if (existingUser) {
                    token.role = existingUser.role
                }
            }

            return token
        },
    },
    pages: {
        signIn: "/auth/sign-in",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
})
