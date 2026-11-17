import { auth } from "@/auth"
import AppLayout from "@/components/app-layout"
import { notFound } from "next/navigation"
import { getLessonDetail } from "@/actions/lessons"
import { LessonPlayerClient } from "./lesson-player-client"

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string; lessonId: string }>
}) {
    const { id, lessonId } = await params
    const detail = await getLessonDetail(id, lessonId)
    if (!detail) {
        return {
            title: "Lesson | PadhoBadho",
            description: "Interactive structured lesson with formulas and step-by-step concepts."
        }
    }
    return {
        title: `${detail.lesson.title} | ${detail.course.name}`,
        description: "Interactive structured lesson with formulas and step-by-step concepts."
    }
}

export default async function LessonPage({
    params
}: {
    params: Promise<{ id: string; lessonId: string }>
}) {
    const { id, lessonId } = await params
    const session = await auth()
    const detail = await getLessonDetail(id, lessonId)

    if (!detail) notFound()

    return (
        <AppLayout session={session}>
            <LessonPlayerClient
                course={detail.course}
                chapter={detail.chapter}
                lesson={detail.lesson}
                prevLesson={detail.prevLesson}
                nextLesson={detail.nextLesson}
                allLessons={detail.allLessons}
            />
        </AppLayout>
    )
}
