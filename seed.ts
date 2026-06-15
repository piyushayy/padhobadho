import { Exam, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // 1. Create Subjects
    const math = await prisma.subject.upsert({
        where: { name: "Mathematics" },
        update: {},
        create: {
            name: "Mathematics",
            description: "CUET Domain Subject: Algebra, Calculus, and Vectors.",
        },
    })

    const english = await prisma.subject.upsert({
        where: { name: "English" },
        update: {},
        create: {
            name: "English",
            description: "Language Paper: Reading Comprehension, Verbal Ability.",
        },
    })

    const physics = await prisma.subject.upsert({
        where: { name: "Physics" },
        update: {},
        create: {
            name: "Physics",
            description: "CUET Domain Subject: Mechanics, Optics, and Modern Physics.",
        },
    })

    const gk = await prisma.subject.upsert({
        where: { name: "General Knowledge" },
        update: {},
        create: {
            name: "General Knowledge",
            description: "General Test: Current Affairs, History, and Geography.",
        },
    })

    // 2. Create Topics
    const calculus = await prisma.topic.upsert({
        where: { name_subjectId: { name: "Calculus", subjectId: math.id } },
        update: {},
        create: { name: "Calculus", subjectId: math.id },
    })

    const optics = await prisma.topic.upsert({
        where: { name_subjectId: { name: "Optics", subjectId: physics.id } },
        update: {},
        create: { name: "Optics", subjectId: physics.id },
    })

    const history = await prisma.topic.upsert({
        where: { name_subjectId: { name: "History", subjectId: gk.id } },
        update: {},
        create: { name: "History", subjectId: gk.id },
    })

    const rc = await prisma.topic.upsert({
        where: { name_subjectId: { name: "Reading Comprehension", subjectId: english.id } },
        update: {},
        create: { name: "Reading Comprehension", subjectId: english.id },
    })

    // 3. Create Questions
    const questions = [
        {
            content: "What is the derivative of sin(x)?",
            options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"],
            correctOption: 0,
            explanation: "The derivative of the sine function is the cosine function.",
            difficulty: "EASY",
            subjectId: math.id,
            topicId: calculus.id,
        },
        {
            content: "Find the integral of 2x dx.",
            options: ["x^2 + C", "2x^2 + C", "x + C", "2 + C"],
            correctOption: 0,
            explanation: "Using the power rule for integration: ∫2x dx = 2 * (x^2 / 2) = x^2 + C.",
            difficulty: "MEDIUM",
            subjectId: math.id,
            topicId: calculus.id,
        },
        {
            content: "The speed of light in vacuum is approximately:",
            options: ["3 x 10^8 m/s", "3 x 10^6 m/s", "1.5 x 10^8 m/s", "3 x 10^10 m/s"],
            correctOption: 0,
            explanation: "The speed of light in vacuum is a physical constant exactly equal to 299,792,458 meters per second.",
            difficulty: "EASY",
            subjectId: physics.id,
            topicId: optics.id,
        },
        {
            content: "Who was the first Prime Minister of India?",
            options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "B.R. Ambedkar"],
            correctOption: 1,
            explanation: "Jawaharlal Nehru was the first Prime Minister of independent India.",
            difficulty: "EASY",
            subjectId: gk.id,
            topicId: history.id,
        },
        {
            content: "Identify the synonym of 'Meticulous'.",
            options: ["Careless", "Thorough", "Lazy", "Forgetful"],
            correctOption: 1,
            explanation: "Meticulous means showing great attention to detail; very careful and precise.",
            difficulty: "EASY",
            subjectId: english.id,
            topicId: rc.id,
        }
    ]

    for (const q of questions) {
        await prisma.question.upsert({
            where: { id: `q-${q.subjectId}-${q.topicId}-${q.content.substring(0, 10)}` }, // Avoid duplicates if re-run
            update: q as any,
            create: {
                ...q,
                id: `q-${q.subjectId}-${q.topicId}-${q.content.substring(0, 10)}`
            } as any
        })
    }

    // 3.5 Create Exams and Link Subjects
    console.log("🔗 Linking Subjects to Exams...")

    // --- Define Exams ---
    const examsData = [
        { code: "CUET-UG", name: "Common University Entrance Test (UG)", desc: "All India test for UG admission" },
        { code: "CAT", name: "Common Admission Test", desc: "For MBA admissions in IIMs and others." },
        { code: "GATE", name: "Graduate Aptitude Test in Engineering", desc: "For M.Tech and PSU recruitments." },
        { code: "NDA", name: "National Defence Academy", desc: "For admission to Army, Navy and Air Force wings." },
        { code: "CLAT", name: "Common Law Admission Test", desc: "For admission to National Law Universities." },
        { code: "IPU-CET", name: "IP University Common Entrance Test", desc: "For admission to Guru Gobind Singh Indraprastha University." },
    ]

    const exams: Record<string, Exam> = {}

    for (const e of examsData) {
        exams[e.code] = await prisma.exam.upsert({
            where: { code: e.code },
            update: {},
            create: { name: e.name, code: e.code, description: e.desc }
        })
    }

    // --- Create Additional Subjects (if needed) ---
    // --- Create Additional Subjects ---
    const legalReasoning = await prisma.subject.upsert({
        where: { name: "Legal Reasoning" }, update: {}, create: { name: "Legal Reasoning", description: "Law-related logical reasoning." }
    });
    const logicalReasoning = await prisma.subject.upsert({
        where: { name: "Logical Reasoning" }, update: {}, create: { name: "Logical Reasoning", description: "Analytical and logical thinking." }
    });
    const quantitativeAptitude = await prisma.subject.upsert({
        where: { name: "Quantitative Aptitude" }, update: {}, create: { name: "Quantitative Aptitude", description: "Mathematical problems and data interpretation." }
    });
    const chemistry = await prisma.subject.upsert({
        where: { name: "Chemistry" }, update: {}, create: { name: "Chemistry", description: "Study of matter and substances." }
    });
    const biology = await prisma.subject.upsert({
        where: { name: "Biology" }, update: {}, create: { name: "Biology", description: "Study of living organisms." }
    });
    const computerScience = await prisma.subject.upsert({
        where: { name: "Computer Science" }, update: {}, create: { name: "Computer Science", description: "Computing and programming." }
    });
    const accountancy = await prisma.subject.upsert({
        where: { name: "Accountancy" }, update: {}, create: { name: "Accountancy", description: "Financial accounting and analysis." }
    });
    const businessStudies = await prisma.subject.upsert({
        where: { name: "Business Studies" }, update: {}, create: { name: "Business Studies", description: "Business principles and management." }
    });
    const economics = await prisma.subject.upsert({
        where: { name: "Economics" }, update: {}, create: { name: "Economics", description: "Production, distribution, and consumption of goods." }
    });
    const historySubject = await prisma.subject.upsert({
        where: { name: "History" }, update: {}, create: { name: "History", description: "Study of past events." }
    });
    const geography = await prisma.subject.upsert({
        where: { name: "Geography" }, update: {}, create: { name: "Geography", description: "Study of lands, features, inhabitants." }
    });
    const polScience = await prisma.subject.upsert({
        where: { name: "Political Science" }, update: {}, create: { name: "Political Science", description: "Systems of governance and analysis of political activities." }
    });
    const psychology = await prisma.subject.upsert({
        where: { name: "Psychology" }, update: {}, create: { name: "Psychology", description: "Study of mind and behavior." }
    });
    const sociology = await prisma.subject.upsert({
        where: { name: "Sociology" }, update: {}, create: { name: "Sociology", description: "Study of society and social behavior." }
    });
    const varc = await prisma.subject.upsert({
        where: { name: "Verbal Ability & Reading Comprehension" }, update: {}, create: { name: "Verbal Ability & Reading Comprehension", description: "English usage and comprehension." }
    });
    const di = await prisma.subject.upsert({
        where: { name: "Data Interpretation" }, update: {}, create: { name: "Data Interpretation", description: "Interpreting data charts and graphs." }
    });
    const currentAffairs = await prisma.subject.upsert({
        where: { name: "Current Affairs" }, update: {}, create: { name: "Current Affairs", description: "Recent events and general awareness." }
    });
    const managementAptitude = await prisma.subject.upsert({
        where: { name: "Management Aptitude" }, update: {}, create: { name: "Management Aptitude", description: "Business awareness and managerial skills." }
    });

    // --- Define Links ---
    const examSubjects = {
        "CUET-UG": [
            // Common
            english, gk,
            // Science
            physics, chemistry, biology, math, computerScience,
            // Commerce
            accountancy, businessStudies, economics,
            // Humanities
            historySubject, geography, polScience, psychology, sociology
        ],
        "CAT": [varc, di, logicalReasoning, quantitativeAptitude],
        "GATE": [math, physics, chemistry], // simplified
        "NDA": [math, physics, chemistry, gk, english],
        "CLAT": [english, currentAffairs, legalReasoning, logicalReasoning], // Note: user didn't mention Quant for CLAT, removing it to be precise? "english language, current affairs, legal reasoning, logical reasoning"
        "IPU-CET": [english, gk, logicalReasoning, managementAptitude],
    };

    // --- Process Links ---
    for (const [examCode, subjects] of Object.entries(examSubjects)) {
        if (!exams[examCode]) continue;

        for (const subject of subjects) {
            await prisma.subject.update({
                where: { id: subject.id },
                data: {
                    exams: {
                        connect: { id: exams[examCode].id }
                    }
                }
            })
        }
    }

    // 4. Create Achievements (Trophies, Badges, Medals)
    const achievementsData = [
        {
            name: "The Apprentice",
            description: "Answered your first question. The journey begins.",
            icon: "Badge"
        },
        {
            name: "Bronze Practitioner",
            description: "Answered 50 questions with the grit of a scholar.",
            icon: "MedalBronze"
        },
        {
            name: "Silver Scholar",
            description: "Answered 250 questions. Your endurance is remarkable.",
            icon: "MedalSilver"
        },
        {
            name: "Golden Intellectual",
            description: "Answered 1000 questions. A beacon of wisdom.",
            icon: "MedalGold"
        },
        {
            name: "Diamond Rank",
            description: "Answered 2500 questions. Legacy of Padhobadhao.",
            icon: "TrophyDiamond"
        },
        {
            name: "Accuracy Ace",
            description: "Achieved 95% accuracy in a single session.",
            icon: "Target"
        },
        {
            name: "Subject Master",
            description: "Masters all topics in a specific domain.",
            icon: "Star"
        },
        {
            name: "Mock Finisher",
            description: "Completed your first high-stakes Mock Test.",
            icon: "Zap"
        },
        {
            name: "Centurion",
            description: "Obtained a perfect 100% score in a Mock Test.",
            icon: "TrophyGold"
        },
        {
            name: "Elite Elite",
            description: "Unlock the North Campus Elite premium tier.",
            icon: "ShieldCheck"
        },
        {
            name: "Seven Day Streak",
            description: "Maintained a study streak for 7 consecutive days.",
            icon: "Flame"
        },
        {
            name: "Night Owl",
            description: "Completed a practice session after 10 PM.",
            icon: "Moon"
        },
        {
            name: "Early Bird",
            description: "Completed a practice session before 6 AM.",
            icon: "Sun"
        },
        {
            name: "Speed Demon",
            description: "Answered a question correctly in under 10 seconds.",
            icon: "Timer"
        },
        {
            name: "Unstoppable",
            description: "Maintained a 30-day study streak. Dedication incarnate.",
            icon: "TrophyDiamond"
        },
        {
            name: "Library Rat",
            description: "Read through 50 detailed solution explanations.",
            icon: "BookOpen"
        }
    ]

    for (const ach of achievementsData) {
        await prisma.achievement.upsert({
            where: { name: ach.name },
            update: ach,
            create: ach
        })
    }

    console.log("✅ Seeding complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
