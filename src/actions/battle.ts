"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const DEFAULT_BATTLE_QUESTIONS = [
    {
        id: "battle-q-1",
        content: "What is the unit of electric flux in SI units?",
        options: ["Volt · metre (V·m)", "Newton / Coulomb", "Tesla · metre", "Weber / m²"],
        correctOption: 0,
        explanation: "Electric flux Φ = E · A = (V/m) · m² = V·m."
    },
    {
        id: "battle-q-2",
        content: "Which organelle is responsible for cellular respiration and ATP generation?",
        options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"],
        correctOption: 0,
        explanation: "Mitochondria are the powerhouses of the cell where ATP is produced via oxidative phosphorylation."
    },
    {
        id: "battle-q-3",
        content: "If f'(x) = 3x² - 6x, at what point does f(x) have a local minimum?",
        options: ["x = 2", "x = 0", "x = 3", "x = -2"],
        correctOption: 0,
        explanation: "f'(x) = 3x(x - 2) = 0 => x = 0, 2. f''(x) = 6x - 6. At x = 2, f''(2) = 6 > 0, indicating a local minimum."
    },
    {
        id: "battle-q-4",
        content: "In macroeconomics, GDP deflator measures the ratio of:",
        options: ["Nominal GDP to Real GDP", "Real GDP to Nominal GDP", "Consumer Price Index to Wholesale Price", "Net National Product to GDP"],
        correctOption: 0,
        explanation: "GDP Deflator = (Nominal GDP / Real GDP) × 100, measuring general inflation."
    },
    {
        id: "battle-q-5",
        content: "A train running at 54 km/h crosses a 150m bridge in 20 seconds. What is the length of the train?",
        options: ["150 metres", "120 metres", "180 metres", "200 metres"],
        correctOption: 0,
        explanation: "Speed = 54 × (5/18) = 15 m/s. Total distance = 15 × 20 = 300m. Train length = 300 - 150 = 150m."
    }
]

export async function getBattleQuestions(subjectId?: string) {
    try {
        const questions = await prisma.question.findMany({
            where: subjectId ? { subjectId } : undefined,
            take: 20
        })

        if (questions && questions.length >= 5) {
            const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 5)
            return shuffled.map(q => ({
                id: q.id,
                content: q.content,
                options: Array.isArray(q.options) ? q.options as string[] : [],
                correctOption: q.correctOption,
                explanation: q.explanation || "Detailed concept explanation available in practice vault."
            }))
        }
    } catch {
        // Fallback safely for offline DB
    }

    return DEFAULT_BATTLE_QUESTIONS
}

export async function submitBattleResult(data: {
    userScore: number
    opponentScore: number
    timeSpent: number
}) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const isWinner = data.userScore > data.opponentScore
    const isTie = data.userScore === data.opponentScore
    const xpReward = isWinner ? 100 : isTie ? 50 : 25

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                xp: { increment: xpReward }
            }
        })
    } catch {
        // Offline db safe
    }

    revalidatePath("/dashboard")
    revalidatePath("/leaderboard")

    return {
        success: true,
        isWinner,
        isTie,
        xpReward,
        message: isWinner
            ? "🏆 VICTORY! You cooked your opponent in the sprint."
            : isTie
                ? "🤝 TIED! A closely matched battle of minds."
                : "⚡ Good fight! Review your concepts to win the rematch."
    }
}
