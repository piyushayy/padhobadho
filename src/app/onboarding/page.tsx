import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnboardingFlow from "./onboarding-flow"

export default async function OnboardingPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/sign-in")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true }
    }).catch((e) => {
        console.error("Critical: Onboarding Prisma Error", e)
        return null
    })

    if (user?.onboardingCompleted) {
        redirect("/dashboard")
    }

    return <OnboardingFlow />
}
