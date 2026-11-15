// Script to grant or create ADMIN role for any user email
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3]?.trim();

  if (!email) {
    console.error("Usage: npm run make-admin <user-email> [optional-password]");
    process.exit(1);
  }

  try {
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'ADMIN',
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
      create: {
        email,
        name: email.split('@')[0],
        role: 'ADMIN',
        onboardingCompleted: true,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    console.log(`\n✅ Success! User [${user.email}] is now registered with role: ADMIN`);
    if (password) {
      console.log(`🔑 Credentials Login: email: ${user.email} | password: ${password}`);
    } else {
      console.log(`🔑 Login via: Google Sign-In with ${user.email}`);
    }
    console.log(`👉 Access the admin panel directly at: http://localhost:3000/admin (or https://padhobadho.in/admin)\n`);
  } catch (error) {
    console.error(`\n❌ Error:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
