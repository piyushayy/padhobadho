import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBattleQuestions } from "@/actions/battle"
import { BattleClient } from "./battle-client"
import AppLayout from "@/components/app-layout"

export const metadata = {
    title: "1v1 Battle Arena | PadhoBadho",
    description: "Challenge other aspirants across India to a 1v1 rapid-fire conceptual sprint. 5 questions, winner takes +100 XP.",
}

export default async function BattlePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/sign-in?callbackUrl=/battle")

    const questions = await getBattleQuestions()
    const userName = session.user.name || "Aspirant"

    return (
        <AppLayout session={session}>
            <div className="min-h-screen py-8">
                <BattleClient questions={questions} userName={userName} />
            </div>
        </AppLayout>
    )
}
