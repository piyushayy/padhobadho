import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminResourcesClient from "./resources-client"

export default async function AdminResourcesPage() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") redirect("/dashboard")

    const [resources, subjects] = await Promise.all([
        prisma.resource.findMany({
            include: { subject: true },
            orderBy: { createdAt: "desc" }
        }),
        prisma.subject.findMany({
            include: { topics: true },
            orderBy: { name: "asc" }
        })
    ])

    return (
        <AdminResourcesClient
            initialResources={resources}
            subjects={subjects}
        />
    )
}
