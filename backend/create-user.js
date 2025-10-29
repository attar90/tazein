const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@tazein.com',  // ایمیل جدید
      phone: '09120000000',      // شماره جدید
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  
  console.log('User created successfully:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());