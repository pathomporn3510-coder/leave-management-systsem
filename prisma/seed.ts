import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  // 1. Create Leave Types
  const sickLeave = await prisma.leaveType.upsert({
    where: { name: 'Sick Leave' },
    update: {},
    create: { name: 'Sick Leave', defaultDays: 30 },
  })
  
  const annualLeave = await prisma.leaveType.upsert({
    where: { name: 'Annual Leave' },
    update: {},
    create: { name: 'Annual Leave', defaultDays: 15 },
  })

  // 2. Create Departments
  const engDept = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering' },
  })

  const hrDept = await prisma.department.upsert({
    where: { name: 'Human Resources' },
    update: {},
    create: { name: 'Human Resources' },
  })

  const execDept = await prisma.department.upsert({
    where: { name: 'Executive' },
    update: {},
    create: { name: 'Executive' },
  })

  // 3. Create Positions
  const devPos = await prisma.position.upsert({
    where: { name: 'Developer' },
    update: {},
    create: { name: 'Developer' },
  })

  const managerPos = await prisma.position.upsert({
    where: { name: 'Engineering Manager' },
    update: {},
    create: { name: 'Engineering Manager' },
  })

  const hrPos = await prisma.position.upsert({
    where: { name: 'HR Specialist' },
    update: {},
    create: { name: 'HR Specialist' },
  })
  
  const ceoPos = await prisma.position.upsert({
    where: { name: 'Chief Executive Officer' },
    update: {},
    create: { name: 'Chief Executive Officer' },
  })

  // 4. Create Users and Employees
  
  // CEO
  const ceoUser = await prisma.user.upsert({
    where: { email: 'ceo@company.com' },
    update: {},
    create: {
      email: 'ceo@company.com',
      password,
      role: 'CEO',
      employee: {
        create: {
          employeeCode: 'EMP001',
          firstName: 'Alice',
          lastName: 'Executive',
          departmentId: execDept.id,
          positionId: ceoPos.id
        }
      }
    }
  })

  // HR
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@company.com' },
    update: {},
    create: {
      email: 'hr@company.com',
      password,
      role: 'HR',
      employee: {
        create: {
          employeeCode: 'EMP002',
          firstName: 'Bob',
          lastName: 'Human',
          departmentId: hrDept.id,
          positionId: hrPos.id
        }
      }
    }
  })

  // MANAGER
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@company.com' },
    update: {},
    create: {
      email: 'manager@company.com',
      password,
      role: 'MANAGER',
      employee: {
        create: {
          employeeCode: 'EMP003',
          firstName: 'Charlie',
          lastName: 'Manager',
          departmentId: engDept.id,
          positionId: managerPos.id
        }
      }
    }
  })

  // USER
  const devUser = await prisma.user.upsert({
    where: { email: 'user@company.com' },
    update: {},
    create: {
      email: 'user@company.com',
      password,
      role: 'USER',
      employee: {
        create: {
          employeeCode: 'EMP004',
          firstName: 'David',
          lastName: 'Developer',
          departmentId: engDept.id,
          positionId: devPos.id
        }
      }
    }
  })

  console.log({ ceoUser, hrUser, managerUser, devUser })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
