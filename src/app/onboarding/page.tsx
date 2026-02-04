import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnboardingFlow from "./onboarding-flow"

export default async function OnboardingPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true }
    })

    if (user?.onboardingCompleted) {
        redirect("/dashboard")
    }

    return <OnboardingFlow />
}
