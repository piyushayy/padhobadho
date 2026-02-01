
import { prisma } from "./src/lib/prisma"

async function main() {
    const subjects = await prisma.subject.findMany({
        include: {
            topics: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    console.log("Subject and Topic IDs for JSON Upload:")
    console.log("=====================================")

    for (const subject of subjects) {
        console.log(`\nSubject: ${subject.name}`)
        console.log(`Subject ID: ${subject.id}`)
        console.log("Topics:")
        if (subject.topics.length === 0) {
            console.log("  (No topics found)")
        } else {
            for (const topic of subject.topics) {
                console.log(`  - ${topic.name}: ${topic.id}`)
            }
        }
        console.log("-".repeat(40))
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
