import { auth } from "@/auth"
import AppLayout from "@/components/app-layout"
import { ContestClient } from "./contest-client"

export const metadata = {
    title: "Sunday Contest Arena | PadhoBadho",
    description: "Every Sunday 10:00 AM IST. All-India live mock contest with authentic NTA CBT pattern, AIR prediction, and +500 XP.",
}

export default async function ContestPage() {
    const session = await auth()

    return (
        <AppLayout session={session}>
            <div className="min-h-screen py-8">
                <ContestClient />
            </div>
        </AppLayout>
    )
}
