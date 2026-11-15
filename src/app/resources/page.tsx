import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import AppLayout from "@/components/app-layout"
import { ResourcesBrowser } from "@/components/resources-browser"

export const dynamic = "force-dynamic"

const CURATED_DEFAULT_RESOURCES: Record<string, Array<{ title: string, type: string, description: string, url: string }>> = {
    "CLASS-12": [
        { title: "CBSE Class 12 Previous 5-Year Board Papers (With Marking Scheme)", type: "PDF", description: "Official CBSE past papers with step-by-step marking guidelines.", url: "https://www.cbse.gov.in/cbsenew/question-paper.html" },
        { title: "NCERT Class 12 Physics & Chemistry Core Formula Sheet", type: "NOTES", description: "Every chapter formula, SI units, and standard constants.", url: "/practice" },
        { title: "Class 12 Board Exam Blueprint & High-Weightage Chapters", type: "GUIDE", description: "Strategic marks distribution for Physics, Chemistry, Maths & Biology.", url: "/practice" }
    ],
    "JEE": [
        { title: "JEE Main 2024 Chapter-wise Solved PYQs (All Shifts)", type: "PDF", description: "Official NTA shifts with detailed step-by-step solutions.", url: "https://jeemain.nta.nic.in" },
        { title: "JEE Advanced High-Yield Formula Handbook (PCM)", type: "NOTES", description: "Handwritten quick-revision formula sheet for fast problem-solving.", url: "/practice" },
        { title: "Calculus & Mechanics Shortcut Tricks for Speed", type: "GUIDE", description: "Tested elimination methods and graphical approaches for sub-60s solving.", url: "/practice" }
    ],
    "NEET": [
        { title: "NEET Biology NCERT Line-by-Line High-Yield Capsule", type: "NOTES", description: "Every diagram, scientist name, and exception highlighted.", url: "/practice" },
        { title: "NEET 2024 Question Paper with Complete Answer Key", type: "PDF", description: "Official question booklet with verified answers.", url: "https://exams.nta.ac.in/NEET/" },
        { title: "NEET Chemistry Formula Sheet & Organic Name Reactions", type: "NOTES", description: "All 35 standard named reactions and mechanisms.", url: "/practice" }
    ],
    "CUET-UG": [
        { title: "CUET General Test (Section III) 500 High-Frequency MCQs", type: "PDF", description: "Quantitative aptitude, reasoning, and GK practice set.", url: "/practice" },
        { title: "Official NTA CUET-UG Mock Test Sample Papers", type: "PDF", description: "Official computer-based test interface practice questions.", url: "https://exams.nta.ac.in/CUET-UG/" },
        { title: "Domain Subjects Chapter-Wise Weightage & Syllabus Breakdown", type: "GUIDE", description: "Syllabus mapping across Science, Commerce & Humanities.", url: "/practice" }
    ],
    "SSC": [
        { title: "SSC CGL / CHSL Tier-1 Previous Year Solved Papers", type: "PDF", description: "Full sets with quantitative speed math shortcuts.", url: "https://ssc.gov.in" },
        { title: "English Grammar 100 Golden Rules (Error Spotting)", type: "NOTES", description: "Most repeated rules in SSC CGL, CHSL, and MTS exams.", url: "/practice" },
        { title: "General Awareness Year-End Revision Digest", type: "PDF", description: "High-probability static GK and current affairs compilation.", url: "/practice" }
    ],
    "DSSSB": [
        { title: "DSSSB PRT / TGT / PGT General Paper PYQ Booklet", type: "PDF", description: "Part-A Hindi, English, Reasoning & Math solved sets.", url: "https://dsssb.delhi.gov.in" },
        { title: "Child Development & Pedagogy (CDP) Core Concepts", type: "NOTES", description: "Piaget, Vygotsky, Kohlberg theories summarized with practice MCQs.", url: "/practice" },
        { title: "DSSSB Post-wise Exam Pattern & Negative Marking Guide", type: "GUIDE", description: "Target safe score strategies and time allocation guidelines.", url: "/practice" }
    ]
}

async function ResourcesContent({ searchParams }: { searchParams?: { exam?: string } }) {
    const session = await auth()
    const isGuest = !session?.user?.id

    let targetExamId = ""
    let activeExamCode = searchParams?.exam || ""

    let allExams: any[] = []
    let subjects: any[] = []

    try {
        if (!isGuest) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { targetExamId: true, targetExam: true }
            })
            targetExamId = user?.targetExamId || ""
            if (!activeExamCode && user?.targetExam?.code) {
                activeExamCode = user.targetExam.code
            }
        }

        allExams = await prisma.exam.findMany({ orderBy: { code: "asc" } })
    } catch (err) {
        console.warn("Database notice in resources: using default exam catalog", err)
    }

    if (!allExams || allExams.length === 0) {
        allExams = [
            { id: "exam-class12", code: "CLASS-12", name: "Class 12 Boards" },
            { id: "exam-jee", code: "JEE", name: "JEE Main & Advanced" },
            { id: "exam-neet", code: "NEET", name: "NEET UG" },
            { id: "exam-cuet", code: "CUET-UG", name: "CUET UG" },
            { id: "exam-ssc", code: "SSC", name: "SSC Exams" },
            { id: "exam-dsssb", code: "DSSSB", name: "DSSSB Exams" }
        ]
    }

    const activeExam = allExams.find(e =>
        activeExamCode ? e.code.toUpperCase() === activeExamCode.toUpperCase() : e.id === targetExamId
    ) || allExams[0]

    const selectedExamId = activeExam?.id || ""
    const selectedCode = activeExam?.code || "CLASS-12"

    try {
        subjects = await prisma.subject.findMany({
            where: selectedExamId ? {
                exams: {
                    some: { id: selectedExamId }
                }
            } : undefined,
            include: {
                resources: true,
                _count: { select: { questions: true } }
            },
            orderBy: { name: "asc" }
        })
    } catch (err) {
        console.warn("Database notice in resources: using empty subjects fallback", err)
    }

    const fallbackResources = CURATED_DEFAULT_RESOURCES[selectedCode] || CURATED_DEFAULT_RESOURCES["CLASS-12"]

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                        <Sparkles size={12} /> 100% Free Study Vault
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-2 text-foreground">
                        {activeExam?.name || "Exam"} Vault
                    </h1>
                    <p className="text-muted-foreground font-medium text-base md:text-lg">
                        Verified Previous Year Papers (PYQs), formulas, and chapter summaries. Completely free for all students.
                    </p>
                </div>

                <Link
                    href="/practice"
                    className="px-6 py-3 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 shrink-0"
                >
                    Start Free Practice &rarr;
                </Link>
            </div>

            <ResourcesBrowser
                allExams={allExams}
                activeExam={activeExam}
                featuredResources={fallbackResources}
                subjects={subjects}
            />
        </div>
    )
}

export default async function ResourcesPage(props: { searchParams?: Promise<{ exam?: string }> }) {
    const session = await auth()
    const searchParams = props.searchParams ? await props.searchParams : undefined

    return (
        <AppLayout session={session}>
            <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading Vault...</div>}>
                <ResourcesContent searchParams={searchParams} />
            </Suspense>
        </AppLayout>
    )
}
