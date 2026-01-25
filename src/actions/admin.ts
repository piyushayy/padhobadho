"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function bulkUploadQuestions(data: any[]) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    // Expecting data in format:
    // { subject: "Physics", topic: "Kinematics", content: "...", options: ["A", "B", "C", "D"], correctOption: 0, difficulty: "EASY" }

    const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
    }

    for (const item of data) {
        try {
            // Find or create subject
            let subject = await prisma.subject.findUnique({
                where: { name: item.subject }
            })
            if (!subject) {
                subject = await prisma.subject.create({
                    data: { name: item.subject, description: `${item.subject} for CUET` }
                })
            }

            // Find or create topic
            let topic = await prisma.topic.findFirst({
                where: { name: item.topic, subjectId: subject.id }
            })
            if (!topic) {
                topic = await prisma.topic.create({
                    data: { name: item.topic, subjectId: subject.id }
                })
            }

            // Create question
            await prisma.question.create({
                data: {
                    content: item.content,
                    options: item.options,
                    correctOption: item.correctOption,
                    difficulty: item.difficulty || "MEDIUM",
                    subjectId: subject.id,
                    topicId: topic.id,
                    explanation: item.explanation,
                    pyqYear: item.pyqYear
                }
            })
            results.success++
        } catch (err: any) {
            results.failed++
            results.errors.push(`Error on question "${item.content.substring(0, 20)}...": ${err.message}`)
        }
    }

    revalidatePath("/admin/questions")
    return results
}

export async function getAdminDashboardData() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(now.getDate() - i)
        d.setHours(0, 0, 0, 0)
        return d
    }).reverse()

    const growth = await Promise.all(
        last7Days.map(async (date) => {
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)

            const count = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDay
                    }
                }
            })
            return { date: date.toLocaleDateString('en-US', { weekday: 'short' }), count }
        })
    )

    const premiumCount = await prisma.user.count({ where: { isPremium: true } })
    const revenue = premiumCount * 499 // Assuming ₹499 price

    const engagement = await prisma.sessionQuestion.count({
        where: {
            createdAt: { gte: last7Days[0] }
        }
    })

    return { growth, revenue, engagement }
}

export async function exportStudentsCSV() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
            name: true,
            email: true,
            stream: true,
            targetUniversity: true,
            isPremium: true,
            createdAt: true
        }
    })

    const header = "Name,Email,Stream,Target Uni,Is Elite,Joined At\n"
    const rows = students.map(s => (
        `${s.name},${s.email},${s.stream || 'N/A'},${s.targetUniversity || 'N/A'},${s.isPremium},${s.createdAt.toISOString()}`
    )).join("\n")

    return header + rows
}

// Initialize standard achievement badges
export async function initAchievements() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const standardAchievements = [
        { name: "The Apprentice", description: "Completed your first practice question.", icon: "Badge" },
        { name: "Bronze Practitioner", description: "Attempted 50 questions.", icon: "MedalBronze" },
        { name: "Silver Scholar", description: "Attempted 250 questions.", icon: "MedalSilver" },
        { name: "Golden Intellectual", description: "Attempted 1000 questions.", icon: "MedalGold" },
        { name: "Diamond Rank", description: "Attempted 2500 questions.", icon: "TrophyDiamond" },
        { name: "Subject Master", description: "Achieve 95%+ accuracy in any subject (min 10 questions).", icon: "Star" },
        { name: "Accuracy Ace", description: "Achieve 100% accuracy in a session (min 5 questions).", icon: "Target" },
        { name: "Mock Finisher", description: "Completed your first full-length mock test.", icon: "Zap" },
        { name: "Centurion", description: "Scored 100% in a mock test.", icon: "TrophyGold" },
        { name: "Elite Elite", description: "Upgraded to North Campus Elite status.", icon: "ShieldCheck" },
        { name: "Streak Starter", description: "Maintained a 3-day study streak.", icon: "Zap" },
    ]

    for (const a of standardAchievements) {
        await prisma.achievement.upsert({
            where: { name: a.name },
            update: { description: a.description, icon: a.icon },
            create: a
        })
    }

    return { success: true }
}

export async function initExams() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const exams = [
        { name: "Common University Entrance Test (UG)", code: "CUET-UG", description: "UG Admissions for Central Universities" },
        { name: "Common Admission Test", code: "CAT", description: "Premier MBA Entrance Exam" },
        { name: "Graduate Aptitude Test in Engineering", code: "GATE", description: "Masters & PSU Admissions for Engineers" },
        { name: "National Defence Academy", code: "NDA", description: "Entry into Armed Forces" },
        { name: "Joint Entrance Examination (Main)", code: "JEE-MAIN", description: "Engineering Admissions for NITs/IIITs" },
        { name: "National Eligibility cum Entrance Test", code: "NEET", description: "Medical Admissions for MBBS/BDS" },
        { name: "SSC Combined Graduate Level", code: "SSC-CGL", description: "Recruitment for Group B and C posts" },
        { name: "Common Law Admission Test", code: "CLAT", description: "Premier Law Admissions" },
        { name: "CUET Post Graduate", code: "CUET-PG", description: "PG Admissions for Central Universities" },
    ]

    for (const e of exams) {
        await prisma.exam.upsert({
            where: { code: e.code },
            update: { name: e.name, description: e.description },
            create: e
        })
    }

    // Link existing subjects to CUET-UG by default
    const cuetExam = await prisma.exam.findUnique({ where: { code: "CUET-UG" } })
    if (cuetExam) {
        const subjects = await prisma.subject.findMany()
        for (const s of subjects) {
            await prisma.subject.update({
                where: { id: s.id },
                data: {
                    exams: {
                        connect: { id: cuetExam.id }
                    }
                }
            })
        }
    }

    return { success: true }
}
export async function uploadResource(data: {
    title: string
    type: string
    url: string
    subjectId: string
    topicId?: string
}) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const resource = await prisma.resource.create({
        data: {
            title: data.title,
            type: data.type,
            url: data.url,
            subjectId: data.subjectId,
            topicId: data.topicId
        }
    })

    revalidatePath("/resources")
    revalidatePath("/admin/resources")
    return resource
}

export async function deleteResource(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.resource.delete({
        where: { id }
    })

    revalidatePath("/resources")
    revalidatePath("/admin/resources")
    return { success: true }
}
export async function deleteQuestion(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    // Manually cleanup dependencies to ensure deletion works even without DB cascade
    await prisma.userQuestionHistory.deleteMany({
        where: { questionId: id }
    })

    await prisma.sessionQuestion.deleteMany({
        where: { questionId: id }
    })

    await prisma.question.delete({
        where: { id }
    })

    revalidatePath("/admin/questions")
    return { success: true }
}

export async function deleteSubject(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.subject.delete({
        where: { id }
    })

    revalidatePath("/admin/subjects")
    return { success: true }
}

export async function deleteTopic(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.topic.delete({
        where: { id }
    })

    revalidatePath("/admin/subjects")
    return { success: true }
}

export async function createSubject(data: { name: string, description?: string }) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const subject = await prisma.subject.create({
        data
    })

    revalidatePath("/admin/subjects")
    return subject
}

export async function createTopic(data: { name: string, subjectId: string }) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const topic = await prisma.topic.create({
        data
    })

    revalidatePath("/admin/subjects")
    return topic
}

export async function deleteUser(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.user.delete({
        where: { id }
    })

    revalidatePath("/admin/students")
    return { success: true }
}

export async function exportSubjectPopularityCSV() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const subjects = await prisma.subject.findMany({
        include: {
            _count: { select: { students: true, questions: true } }
        }
    })

    const header = "Subject,Total Students,Total Questions\n"
    const rows = subjects.map(s => (
        `${s.name},${s._count.students},${s._count.questions}`
    )).join("\n")

    return header + rows
}

export async function exportAccuracyAnalyticsCSV() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const performance = await prisma.userPerformanceSummary.findMany({
        include: {
            subject: true,
            user: { select: { name: true, email: true } }
        }
    })

    const header = "Student,Email,Subject,Accuracy (%)\n"
    const rows = performance.map(p => (
        `${p.user.name ?? 'Anonymous'},${p.user.email},${p.subject.name},${(p.totalAccuracy * 100).toFixed(2)}`
    )).join("\n")

    return header + rows
}
