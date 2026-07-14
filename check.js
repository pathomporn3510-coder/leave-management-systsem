const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.leaveType.findMany();
  console.log(t);
}
main().finally(() => prisma.$disconnect());
