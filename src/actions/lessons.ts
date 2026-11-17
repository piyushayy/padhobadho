"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export interface LessonItem {
    id: string
    chapterId: string
    title: string
    slug: string
    durationMin: number
    order: number
    content: string
    completed?: boolean
}

export interface ChapterItem {
    id: string
    courseId: string
    title: string
    description?: string
    order: number
    lessons: LessonItem[]
}

export interface CourseDetail {
    id: string
    name: string
    description: string
    chapters: ChapterItem[]
    totalLessons: number
    completedCount: number
    progressPercent: number
    nextLessonId?: string
}

// Fallback high-yield curricula with Markdown & KaTeX equations
const DEFAULT_CURRICULA: Record<string, { name: string; description: string; chapters: ChapterItem[] }> = {
    "course-science": {
        name: "CUET-UG Science Stream",
        description: "Comprehensive NCERT aligned lessons in Physics, Chemistry, and Mathematics with KaTeX formulas.",
        chapters: [
            {
                id: "chap-phys-1",
                courseId: "course-science",
                title: "Kinematics & Newton's Laws of Motion",
                description: "Vectors, motion in one & two dimensions, projectile motion, and friction.",
                order: 1,
                lessons: [
                    {
                        id: "les-phys-101",
                        chapterId: "chap-phys-1",
                        title: "1. Motion in a Straight Line & Calculus",
                        slug: "motion-in-straight-line",
                        durationMin: 12,
                        order: 1,
                        content: `## Kinematic Equations of Uniform Motion

For an object moving in a straight line under constant acceleration $a$:

$$v = u + at$$

$$s = ut + \\frac{1}{2}at^2$$

$$v^2 = u^2 + 2as$$

### Calculus Formulations

When acceleration varies with time $t$ or position $x$:

- Velocity: $v(t) = \\frac{dx}{dt}$
- Acceleration: $a(t) = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$
- Differential relation: $v \\, dv = a \\, dx$

> **High-Yield Exam Tip**: In projectile motion, velocity at maximum height is purely horizontal:
> $$v_{\\text{top}} = u \\cos \\theta$$
> And maximum horizontal range is achieved at $\\theta = 45^\\circ$:
> $$R_{\\max} = \\frac{u^2}{g}$$`
                    },
                    {
                        id: "les-phys-102",
                        chapterId: "chap-phys-1",
                        title: "2. Work, Energy and Power",
                        slug: "work-energy-power",
                        durationMin: 15,
                        order: 2,
                        content: `## Work-Energy Theorem

The work done by the net force acting on a particle equals the change in its kinetic energy:

$$W_{\\text{net}} = \\Delta K = K_f - K_i$$

Where kinetic energy is defined as:

$$K = \\frac{1}{2}mv^2 = \\frac{p^2}{2m}$$

### Conservative Forces & Potential Energy

A force $\\vec{F}$ is conservative if work done around any closed loop vanishes:

$$\\oint \\vec{F} \\cdot d\\vec{r} = 0$$

Potential energy $U(x)$ is related to conservative force $F(x)$ by:

$$F(x) = -\\frac{dU}{dx}$$

For a spring obeying Hooke's Law with spring constant $k$:

$$U_{\\text{spring}} = \\frac{1}{2}kx^2$$`
                    }
                ]
            },
            {
                id: "chap-chem-1",
                courseId: "course-science",
                title: "Chemical Bonding & Thermodynamics",
                description: "VSEPR theory, Hybridization, First & Second laws of thermodynamics.",
                order: 2,
                lessons: [
                    {
                        id: "les-chem-101",
                        chapterId: "chap-chem-1",
                        title: "1. First Law of Thermodynamics",
                        slug: "first-law-thermodynamics",
                        durationMin: 10,
                        order: 1,
                        content: `## The First Law of Thermodynamics

Energy cannot be created or destroyed, only transformed:

$$\\Delta U = q + w$$

Where:
- $\\Delta U$ is change in internal energy
- $q$ is heat supplied to system ($q > 0$ for endothermic)
- $w$ is work done on system (by IUPAC convention, $w = -P_{\\text{ext}} \\Delta V$)

### Enthalpy Relation

Enthalpy $H$ is defined as:

$$H = U + PV$$

For an ideal gas undergoing a reaction:

$$\\Delta H = \\Delta U + \\Delta n_g R T$$

Where $\\Delta n_g = \\sum n_{\\text{products, gas}} - \\sum n_{\\text{reactants, gas}}$.`
                    }
                ]
            },
            {
                id: "chap-math-1",
                courseId: "course-science",
                title: "Differential & Integral Calculus",
                description: "Limits, continuity, differentiation, and definite integrals.",
                order: 3,
                lessons: [
                    {
                        id: "les-math-101",
                        chapterId: "chap-math-1",
                        title: "1. Derivatives & Rate of Change",
                        slug: "derivatives-rate-of-change",
                        durationMin: 14,
                        order: 1,
                        content: `## Fundamental Definition of Derivative

The instantaneous rate of change of $f(x)$ with respect to $x$ is:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

### Essential Differentiation Rules

- **Product Rule**:
  $$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$

- **Quotient Rule**:
  $$\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$$

- **Chain Rule**:
  $$\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)$$

- **Integration by Parts**:
  $$\\int u \\, dv = uv - \\int v \\, du$$`
                    }
                ]
            }
        ]
    },
    "course-commerce": {
        name: "CUET-UG Commerce & Economics",
        description: "Accountancy, Microeconomics, Macroeconomics, and Business Studies drills.",
        chapters: [
            {
                id: "chap-econ-1",
                courseId: "course-commerce",
                title: "Microeconomics & National Income",
                description: "Elasticity of demand, GDP measurement, and fiscal policy.",
                order: 1,
                lessons: [
                    {
                        id: "les-econ-101",
                        chapterId: "chap-econ-1",
                        title: "1. Price Elasticity of Demand",
                        slug: "price-elasticity-demand",
                        durationMin: 12,
                        order: 1,
                        content: `## Price Elasticity of Demand ($e_d$)

The responsiveness of quantity demanded to a percentage change in price:

$$e_d = \\frac{\\% \\Delta Q}{\\% \\Delta P} = \\frac{\\Delta Q}{\\Delta P} \\cdot \\frac{P}{Q}$$

### Elasticity Classifications

1. **Perfect Inelastic** ($e_d = 0$): Vertical demand curve (lifesaving medicines).
2. **Inelastic** ($0 < |e_d| < 1$): Necessities.
3. **Unit Elastic** ($|e_d| = 1$): Rectangular hyperbola.
4. **Elastic** ($|e_d| > 1$): Luxury goods with many substitutes.

### National Income Identity

In a 4-sector economy:

$$Y = C + I + G + (X - M)$$`
                    }
                ]
            }
        ]
    }
}

async function getCompletedLessonIds(): Promise<Set<string>> {
    const completed = new Set<string>()

    // 1. Check cookies (offline / zero-downtime fallback)
    const cookieStore = await cookies()
    const cookieData = cookieStore.get("pb_lesson_progress")?.value
    if (cookieData) {
        try {
            const parsed = JSON.parse(cookieData)
            if (Array.isArray(parsed)) {
                parsed.forEach(id => completed.add(id))
            }
        } catch {}
    }

    // 2. Check DB if user is logged in
    const session = await auth()
    if (session?.user?.id) {
        try {
            const records = await (prisma as any).lessonProgress?.findMany({
                where: { userId: session.user.id, completed: true },
                select: { lessonId: true }
            })
            if (records) {
                records.forEach((r: any) => completed.add(r.lessonId))
            }
        } catch {
            // DB fallback silently handled
        }
    }

    return completed
}

export async function getCoursesCatalog() {
    const completedSet = await getCompletedLessonIds()

    // Query DB courses if available, merge with default
    let dbCourses: any[] = []
    try {
        dbCourses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { subjects: true, users: true }
                }
            },
            orderBy: { name: "asc" }
        })
    } catch {}

    const catalog = Object.entries(DEFAULT_CURRICULA).map(([id, data]) => {
        let total = 0
        let completed = 0
        data.chapters.forEach(c => {
            c.lessons.forEach(l => {
                total++
                if (completedSet.has(l.id)) completed++
            })
        })

        const percent = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
            id,
            name: data.name,
            description: data.description,
            chapterCount: data.chapters.length,
            lessonCount: total,
            completedCount: completed,
            progressPercent: percent
        }
    })

    return catalog
}

export async function getCourseCurriculum(courseId: string): Promise<CourseDetail | null> {
    const rawCourse = DEFAULT_CURRICULA[courseId] || DEFAULT_CURRICULA["course-science"]
    if (!rawCourse) return null

    const completedSet = await getCompletedLessonIds()

    let totalLessons = 0
    let completedCount = 0
    let nextLessonId: string | undefined = undefined

    const chapters: ChapterItem[] = rawCourse.chapters.map(ch => {
        const lessons = ch.lessons.map(les => {
            totalLessons++
            const isDone = completedSet.has(les.id)
            if (isDone) {
                completedCount++
            } else if (!nextLessonId) {
                nextLessonId = les.id
            }
            return {
                ...les,
                completed: isDone
            }
        })
        return {
            ...ch,
            lessons
        }
    })

    // If all completed, next lesson defaults to first lesson
    if (!nextLessonId && chapters[0]?.lessons[0]) {
        nextLessonId = chapters[0].lessons[0].id
    }

    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    return {
        id: courseId,
        name: rawCourse.name,
        description: rawCourse.description,
        chapters,
        totalLessons,
        completedCount,
        progressPercent,
        nextLessonId
    }
}

export async function getLessonDetail(courseId: string, lessonId: string) {
    const curriculum = await getCourseCurriculum(courseId)
    if (!curriculum) return null

    let targetLesson: LessonItem | null = null
    let targetChapter: ChapterItem | null = null
    const allLessons: LessonItem[] = []

    curriculum.chapters.forEach(ch => {
        ch.lessons.forEach(l => {
            allLessons.push(l)
            if (l.id === lessonId || l.slug === lessonId) {
                targetLesson = l
                targetChapter = ch
            }
        })
    })

    if (!targetLesson) return null

    const foundLesson: LessonItem = targetLesson
    const currentIndex = allLessons.findIndex(l => l.id === foundLesson.id)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    return {
        course: { id: curriculum.id, name: curriculum.name },
        chapter: targetChapter,
        lesson: foundLesson,
        prevLesson,
        nextLesson,
        allLessons
    }
}

export async function markLessonComplete(courseId: string, lessonId: string) {
    const cookieStore = await cookies()
    const cookieData = cookieStore.get("pb_lesson_progress")?.value
    let completedList: string[] = []

    if (cookieData) {
        try {
            completedList = JSON.parse(cookieData)
        } catch {}
    }

    if (!completedList.includes(lessonId)) {
        completedList.push(lessonId)
    }

    // Save to cookie (1 year expiry)
    cookieStore.set("pb_lesson_progress", JSON.stringify(completedList), {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax"
    })

    // Save to DB and award XP if logged in
    const session = await auth()
    if (session?.user?.id) {
        try {
            await (prisma as any).lessonProgress?.upsert({
                where: {
                    userId_lessonId: { userId: session.user.id, lessonId }
                },
                update: { completed: true, completedAt: new Date() },
                create: {
                    userId: session.user.id,
                    lessonId,
                    completed: true,
                    completedAt: new Date()
                }
            })

            // Award +20 XP for completing a lesson
            await prisma.user.update({
                where: { id: session.user.id },
                data: { xp: { increment: 20 } }
            })
        } catch {
            // DB fallback
        }
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)

    return { success: true, xpEarned: 20 }
}
