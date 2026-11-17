"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getFollowingUserIds(): Promise<string[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    const cookieStore = await cookies()
    const raw = cookieStore.get(`pb_following_${session.user.id}`)?.value
    if (!raw) return []

    try {
        return JSON.parse(raw) as string[]
    } catch {
        return []
    }
}

export async function toggleFollowUser(targetUserId: string): Promise<{ success: boolean; isFollowing: boolean }> {
    const session = await auth()
    if (!session?.user?.id) return { success: false, isFollowing: false }

    const userId = session.user.id
    if (userId === targetUserId) return { success: false, isFollowing: false }

    const cookieStore = await cookies()
    const cookieKey = `pb_following_${userId}`
    let following = await getFollowingUserIds()

    let isFollowing = false
    if (following.includes(targetUserId)) {
        following = following.filter(id => id !== targetUserId)
        isFollowing = false
    } else {
        following.push(targetUserId)
        isFollowing = true
    }

    cookieStore.set(cookieKey, JSON.stringify(following), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax"
    })

    revalidatePath("/leaderboard")
    return { success: true, isFollowing }
}

export async function getFriendLeaderboard() {
    const session = await auth()
    if (!session?.user?.id) return { friends: [], followingIds: [] }

    const userId = session.user.id
    const followingIds = await getFollowingUserIds()
    const candidateIds = Array.from(new Set([userId, ...followingIds]))

    try {
        const users = await prisma.user.findMany({
            where: { id: { in: candidateIds } },
            orderBy: { xp: "desc" },
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                level: true,
                currentStreak: true,
            }
        })
        return { friends: users, followingIds }
    } catch {
        return { friends: [], followingIds }
    }
}
