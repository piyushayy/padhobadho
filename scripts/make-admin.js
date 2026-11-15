// Script to grant ADMIN role to any user email
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/make-admin.js <user-email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`✅ Success! User ${user.email} (Name: ${user.name || 'N/A'}) is now an ADMIN.`);
    console.log(`👉 Access the admin panel at: http://localhost:3000/admin (or https://padhobadho.in/admin)`);
  } catch (error) {
    console.error(`❌ Error promoting ${email}:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
