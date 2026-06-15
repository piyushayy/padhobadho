import { prisma } from "@/lib/prisma"
import { getAdminDashboardData } from "@/actions/admin"
import AdminDashboardClient from "./admin-dashboard-client"

export default async function AdminDashboard() {
    const [questionCount, userCount, insightData] = await Promise.all([
        prisma.question.count(),
        prisma.user.count(),
        getAdminDashboardData()
    ])

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
