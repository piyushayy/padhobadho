import { prisma } from "./src/lib/prisma"

async function main() {
    const exams = await prisma.exam.findMany()
    console.log("Exams:", exams)
}

main()
