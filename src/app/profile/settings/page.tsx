import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsClient from "./settings-client"
import AppLayout from "@/components/app-layout"

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            username: true,
            stream: true,
            targetUniversity: true,
            targetCourse: true,
            dailyGoal: true,
            level: true,
            xp: true,
            currentStreak: true
        }
    })

    if (!user) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <div className="min-h-screen pt-12">
                <SettingsClient user={user} />
            </div>
        </AppLayout>
    )
}
