import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import OnboardingFlow from "./onboarding-flow"

export default async function OnboardingPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    // If already completed, redirect to dashboard
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true }
    })

    if (user?.onboardingCompleted) {
        redirect("/dashboard")
    }

    let [subjects, exams] = await Promise.all([
        prisma.subject.findMany({
            select: {
                id: true,
                name: true,
                exams: { select: { id: true, code: true } }
            },
            orderBy: { name: "asc" }
        }),
        prisma.exam.findMany({
            orderBy: { name: "asc" }
        })
    ])

    // Connectivity fix: Auto-seed exams if none exist
    if (exams.length === 0) {
        const defaultExams = [
            { name: "Common University Entrance Test (UG)", code: "CUET-UG" },
            { name: "Common Admission Test", code: "CAT" },
            { name: "Graduate Aptitude Test in Engineering", code: "GATE" },
            { name: "National Defence Academy", code: "NDA" },
            { name: "IP University Common Entrance Test", code: "IPU-CET" },
            { name: "Common Law Admission Test", code: "CLAT" },
        ]

        for (const e of defaultExams) {
            await prisma.exam.upsert({
                where: { code: e.code },
                update: {},
                create: e
            })
        }
        exams = await prisma.exam.findMany({ orderBy: { name: "asc" } })
    }

    return <OnboardingFlow subjects={subjects} exams={exams} />
}
