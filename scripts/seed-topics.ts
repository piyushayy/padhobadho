
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

// Define the schema for our seed data
const TopicSchema = z.object({
    name: z.string(),
    slug: z.string().optional(), // clean_slug
    order: z.number().default(0),
})

const SubjectSchema = z.object({
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
    topics: z.array(TopicSchema).default([]),
})

const CurriculumSchema = z.array(SubjectSchema)

// Example Data (Replace with full curriculum JSON or load from file)
const initialCurriculum = [
    {
        name: "Mathematics",
        order: 1,
        description: "Core mathematics for competitive exams.",
        topics: [
            { name: "Algebra", order: 1 },
            { name: "Calculus", order: 2 },
            { name: "Geometry", order: 3 },
        ]
    },
    {
        name: "Physics",
        order: 2,
        topics: [
            { name: "Mechanics", order: 1 },
            { name: "Thermodynamics", order: 2 },
            { name: "Optics", order: 3 },
        ]
    }
]

async function main() {
    console.log("🌱 Starting seeding...")

    const subjects = CurriculumSchema.parse(initialCurriculum)

    for (const subjectData of subjects) {
        console.log(`Processing Subject: ${subjectData.name}`)

        // Upsert Subject
        const subject = await prisma.subject.upsert({
            where: { name: subjectData.name },
            update: {
                order: subjectData.order,
                clean_slug: subjectData.slug || subjectData.name.toLowerCase().replace(/\s+/g, '-'),
                description: subjectData.description,
            },
            create: {
                name: subjectData.name,
                order: subjectData.order,
                clean_slug: subjectData.slug || subjectData.name.toLowerCase().replace(/\s+/g, '-'),
                description: subjectData.description,
            },
        })

        // Upsert Topics
        for (const topicData of subjectData.topics) {
            await prisma.topic.upsert({
                where: {
                    name_subjectId: {
                        name: topicData.name,
                        subjectId: subject.id,
                    }
                },
                update: {
                    order: topicData.order,
                    clean_slug: topicData.slug || topicData.name.toLowerCase().replace(/\s+/g, '-'),
                },
                create: {
                    name: topicData.name,
                    subjectId: subject.id,
                    order: topicData.order,
                    clean_slug: topicData.slug || topicData.name.toLowerCase().replace(/\s+/g, '-'),
                },
            })
        }
    }

    console.log("✅ Seeding completed.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
