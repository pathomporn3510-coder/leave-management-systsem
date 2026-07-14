"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcrypt"

const employeeSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "MANAGER", "HR", "CEO"]),
  departmentId: z.string().min(1, "Department is required"),
  positionId: z.string().min(1, "Position is required"),
})

export async function getEmployees() {
  return await prisma.employee.findMany({
    include: {
      user: true,
      department: true,
      position: true
    },
    orderBy: { firstName: "asc" }
  })
}

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
  try {
    const validated = employeeSchema.parse(data)
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Transaction to create User and Employee together
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validated.email,
          password: hashedPassword,
          role: validated.role,
        }
      })

      const employee = await tx.employee.create({
        data: {
          employeeCode: validated.employeeCode,
          firstName: validated.firstName,
          lastName: validated.lastName,
          userId: user.id,
          departmentId: validated.departmentId,
          positionId: validated.positionId,
        }
      })
      
      // Initialize Leave Balances
      const leaveTypes = await tx.leaveType.findMany()
      const currentYear = new Date().getFullYear()
      
      const balances = leaveTypes.map(lt => ({
        employeeId: employee.id,
        leaveTypeId: lt.id,
        year: currentYear,
        totalDays: lt.defaultDays,
        usedDays: 0
      }))
      
      if (balances.length > 0) {
        await tx.leaveBalance.createMany({
          data: balances
        })
      }
    })

    revalidatePath("/dashboard/hr/employees")
    return { success: true }
  } catch (error: any) {
    console.error("Create employee error:", error)
    return { success: false, error: "Failed to create employee" }
  }
}
