// Seed script for the 6 core exams, courses, and subjects
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CORE_EXAMS = [
  {
    name: "Class 12 Boards",
    code: "CLASS-12",
    description: "CBSE, ICSE & State Boards Class 12 Syllabus, Model Papers & PYQs",
    courseName: "Class 12 Boards Prep",
    subjects: ["Physics 12", "Chemistry 12", "Mathematics 12", "Biology 12", "English Core", "Accountancy", "Economics"]
  },
  {
    name: "JEE (Main & Advanced)",
    code: "JEE",
    description: "Joint Entrance Examination for Engineering Admissions",
    courseName: "JEE Main & Advanced",
    subjects: ["Physics (JEE)", "Chemistry (JEE)", "Mathematics (JEE)"]
  },
  {
    name: "NEET-UG",
    code: "NEET",
    description: "National Eligibility cum Entrance Test for Medical (MBBS/BDS)",
    courseName: "NEET-UG Medical",
    subjects: ["Physics (NEET)", "Chemistry (NEET)", "Botany & Zoology (NEET)"]
  },
  {
    name: "CUET-UG",
    code: "CUET-UG",
    description: "Common University Entrance Test for Central & Top Universities",
    courseName: "CUET-UG Comprehensive",
    subjects: ["General Test (CUET)", "English Language", "Economics (CUET)", "Business Studies", "Political Science"]
  },
  {
    name: "SSC (CGL, CHSL, MTS)",
    code: "SSC",
    description: "Staff Selection Commission Government Recruitment Exams",
    courseName: "SSC Exam Track",
    subjects: ["Quantitative Aptitude (SSC)", "Reasoning Ability (SSC)", "General Awareness (SSC)", "English Comprehension (SSC)"]
  },
  {
    name: "DSSSB",
    code: "DSSSB",
    description: "Delhi Subordinate Services Selection Board Teaching & Non-Teaching Posts",
    courseName: "DSSSB Recruitment Track",
    subjects: ["General Paper (DSSSB)", "Arithmetical & Numerical Ability", "General Hindi & English", "Teaching Aptitude"]
  }
];

async function seed() {
  console.log("🌱 Seeding core target exams, courses & subjects...");

  for (const item of CORE_EXAMS) {
    // 1. Upsert Exam
    const exam = await prisma.exam.upsert({
      where: { code: item.code },
      update: { name: item.name, description: item.description },
      create: { name: item.name, code: item.code, description: item.description },
    });
    console.log(`✅ Exam: [${exam.code}] ${exam.name}`);

    // 2. Upsert Course
    const course = await prisma.course.upsert({
      where: { name: item.courseName },
      update: { description: item.description },
      create: { name: item.courseName, description: item.description },
    });
    console.log(`  └─ Course: ${course.name}`);

    // 3. Upsert Subjects and Link to Exam & Course
    for (const subName of item.subjects) {
      const subject = await prisma.subject.upsert({
        where: { name: subName },
        update: {
          exams: { connect: { id: exam.id } },
          courses: { connect: { id: course.id } }
        },
        create: {
          name: subName,
          exams: { connect: { id: exam.id } },
          courses: { connect: { id: course.id } }
        }
      });
      console.log(`     └─ Subject: ${subject.name}`);
    }
  }

  console.log("\n🎉 All 6 target exams, courses, and subjects seeded successfully!");
}

seed()
  .catch((e) => console.error("Error seeding exams:", e))
  .finally(() => prisma.$disconnect());
