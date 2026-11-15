import { prisma } from "@/lib/prisma"
import { FeedbackWidget } from "@/components/feedback-widget"
import { AppHeader } from "@/components/app-header"
import { DesktopSidebar, MobileBottomNav } from "@/components/navigation"
import { serialize } from "@/lib/utils"

export default async function AppLayout({ children, session }: { children: React.ReactNode, session: any }) {
    const isGuest = !session?.user?.id

    let user: any = null
    let allExams: any[] = []

    try {
        if (!isGuest) {
            const [userData, examsData] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: session.user.id },
                    include: { targetExam: true }
                }),
                prisma.exam.findMany({ orderBy: { code: "asc" } })
            ])
            user = userData
            allExams = examsData || []
        } else {
            allExams = await prisma.exam.findMany({ orderBy: { code: "asc" } })
        }
    } catch (error) {
        console.error("Layout Data Fetch Failed", error)
    }

    // Sanitize data for client components
    const sanitizedUser = user ? serialize(user) : null
    const sanitizedExams = serialize(allExams)

    const userName = session?.user?.name || (isGuest ? "Guest" : "Student")
    const userInitials = userName[0]?.toUpperCase() || (isGuest ? "G" : "S")

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-0">
            {/* Sidebar - Desktop Only */}
            <DesktopSidebar />

            {/* Main Content */}
            <main className="lg:ml-64">
                {/* Header */}
                <AppHeader user={sanitizedUser} allExams={sanitizedExams} userName={userName} userInitials={userInitials} />

                <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Nav - Hidden on Desktop */}
            <MobileBottomNav />
            <FeedbackWidget />
        </div>
    )
}
