import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsClient from "./settings-client"
import AppLayout from "@/components/app-layout"
import { getUserActivityHeatmap } from "@/actions/gamification"

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const [user, activityHeatmap] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                stream: true,
                targetUniversity: true,
                targetCourse: true,
                dailyGoal: true,
                level: true,
                xp: true,
                currentStreak: true,
                longestStreak: true
            }
        }),
        getUserActivityHeatmap(session.user.id)
    ])

    if (!user) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <div className="pb-12">
                <SettingsClient user={user} activityHeatmap={activityHeatmap} />
            </div>
        </AppLayout>
    )
}
