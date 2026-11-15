import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDailyChallenge } from "@/actions/daily-challenge"
import DailyChallengeClient from "./daily-challenge-client"
import AppLayout from "@/components/app-layout"

export const dynamic = "force-dynamic"

export default async function DailyChallengePage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/sign-in")

    const challenge = await getDailyChallenge()

    if (!challenge) {
        return (
            <AppLayout session={session}>
                <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
                    <h2 className="text-2xl font-bold font-serif">Daily Challenge Unavailable</h2>
                    <p className="text-muted-foreground">No questions found in the library. Please check back shortly.</p>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout session={session}>
            <DailyChallengeClient challenge={challenge} />
        </AppLayout>
    )
}
