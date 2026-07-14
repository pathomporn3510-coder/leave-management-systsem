import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get Leave Types
  const sickLeave = await prisma.leaveType.findUnique({ where: { name: 'Sick Leave' } })
  const annualLeave = await prisma.leaveType.findUnique({ where: { name: 'Annual Leave' } })

  if (!sickLeave || !annualLeave) {
    console.error("Leave types not found. Run seed first.")
    return
  }

  // Get Employees
  const dev = await prisma.employee.findUnique({ where: { employeeCode: 'EMP004' } })
  const hr = await prisma.employee.findUnique({ where: { employeeCode: 'EMP002' } })
  const manager = await prisma.employee.findUnique({ where: { employeeCode: 'EMP003' } })

  if (!dev || !hr || !manager) {
    console.error("Employees not found.")
    return
  }

  // Calculate dates
  const today = new Date()
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekEnd = new Date(nextWeek)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 2)

  // Create Leave Requests
  const req1 = await prisma.leaveRequest.create({
    data: {
      employeeId: dev.id,
      leaveTypeId: annualLeave.id,
      startDate: nextWeek,
      endDate: nextWeekEnd,
      days: 3,
      reason: "พักผ่อนประจำปีกับครอบครัว",
      status: "HR_APPROVED",
    }
  })

  const req2 = await prisma.leaveRequest.create({
    data: {
      employeeId: manager.id,
      leaveTypeId: sickLeave.id,
      startDate: tomorrow,
      endDate: tomorrow,
      days: 1,
      reason: "ไปหาหมอตรวจสุขภาพ",
      status: "HR_APPROVED",
    }
  })

  const req3 = await prisma.leaveRequest.create({
    data: {
      employeeId: hr.id,
      leaveTypeId: annualLeave.id,
      startDate: tomorrow,
      endDate: tomorrow,
      days: 1,
      reason: "ทำธุระส่วนตัวที่ธนาคาร",
      status: "HR_APPROVED",
    }
  })

  console.log("Simulated leaves created successfully:", { req1: req1.id, req2: req2.id, req3: req3.id })
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
