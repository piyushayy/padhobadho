import { prisma } from "@/lib/prisma"
import { getAdminDashboardData } from "@/actions/admin"
import AdminDashboardClient from "./admin-dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    let questionCount = 0
    let userCount = 0
    let insightData: any = {}

    try {
        const results = await Promise.all([
            prisma.question.count(),
            prisma.user.count(),
            getAdminDashboardData()
        ])
        questionCount = results[0]
        userCount = results[1]
        insightData = results[2]
    } catch (e) {
        console.error("Failed to load admin dashboard data:", e)
    }

    return (
        <AdminDashboardClient
            stats={{
                ...insightData,
                userCount,
                questionCount
            }}
        />
    )
}
