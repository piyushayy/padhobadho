import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "ADMIN" | "STUDENT"
            isPremium: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: "ADMIN" | "STUDENT"
        isPremium: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "ADMIN" | "STUDENT"
        isPremium: boolean
    }
}
