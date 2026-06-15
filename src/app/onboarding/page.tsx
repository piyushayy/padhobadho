import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnboardingFlow from "./onboarding-flow"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            redirect("/auth/sign-in")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { onboardingCompleted: true }
        })

        if (user?.onboardingCompleted) {
            redirect("/dashboard")
        }

        return <OnboardingFlow />
    } catch (error: any) {
        // Next.js redirects work by throwing an error, so we must re-throw it
        if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
            throw error
        }

        console.error("[CRITICAL] Onboarding Page Error:", error)
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <h1 className="text-xl font-bold text-rose-500">Something went wrong</h1>
                <p>We couldn't load your profile setup. Please check your connection and refresh.</p>
                <div className="p-4 bg-muted rounded text-xs font-mono text-left max-w-md overflow-auto">
                    {error?.message || "Unknown Error"}
                </div>
            </div>
        )
    }
}
