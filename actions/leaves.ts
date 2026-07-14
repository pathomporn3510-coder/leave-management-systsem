"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { differenceInDays } from "date-fns"

const submitLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  reason: z.string().min(5, "Please provide a detailed reason"),
})

export async function getLeaveRequests(role: string, departmentId?: string) {
  let whereClause = {}
  
  if (role === "MANAGER" && departmentId) {
    whereClause = {
      employee: { departmentId: departmentId },
      status: "PENDING"
    }
  } else if (role === "HR") {
    whereClause = { status: "MANAGER_APPROVED" }
  } else if (role === "CEO") {
    whereClause = { status: "HR_APPROVED" }
  } else if (role === "USER") {
    const session = await getServerSession(authOptions)
    whereClause = { employeeId: session?.user?.employeeId }
  }
  
  return await prisma.leaveRequest.findMany({
    where: whereClause,
    include: {
      employee: {
        include: { department: true, position: true }
      },
      leaveType: true
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function submitLeave(data: z.infer<typeof submitLeaveSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.employeeId) throw new Error("Unauthorized")
      
    const validated = submitLeaveSchema.parse(data)
    
    // Calculate days
    const days = differenceInDays(validated.endDate, validated.startDate) + 1
    
    if (days <= 0) throw new Error("Invalid date range")
      
    // Check balance
    const currentYear = new Date().getFullYear()
    const balance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: session.user.employeeId,
          leaveTypeId: validated.leaveTypeId,
          year: currentYear
        }
      }
    })
    
    if (!balance || (balance.totalDays - balance.usedDays) < days) {
      return { success: false, error: "Insufficient leave balance" }
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: session.user.employeeId,
        leaveTypeId: validated.leaveTypeId,
        startDate: validated.startDate,
        endDate: validated.endDate,
        days: days,
        reason: validated.reason,
        status: "PENDING",
      }
    })
    
    await prisma.leaveHistory.create({
      data: {
        leaveRequestId: leaveRequest.id,
        action: "SUBMITTED",
        actorId: session.user.employeeId,
      }
    })

    // TODO: Send Email Notification to Manager

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit leave" }
  }
}

export async function updateLeaveStatus(id: string, newStatus: string, comment?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.employeeId) throw new Error("Unauthorized")

    await prisma.leaveRequest.update({
      where: { id },
      data: { status: newStatus as any }
    })
    
    await prisma.leaveHistory.create({
      data: {
        leaveRequestId: id,
        action: newStatus,
        actorId: session.user.employeeId,
        comment: comment
      }
    })

    // If fully approved (CEO_APPROVED), update leave balance
    if (newStatus === "CEO_APPROVED") {
      const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id }})
      if (leaveRequest) {
        const currentYear = new Date().getFullYear()
        await prisma.leaveBalance.update({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: leaveRequest.employeeId,
              leaveTypeId: leaveRequest.leaveTypeId,
              year: currentYear
            }
          },
          data: {
            usedDays: { increment: leaveRequest.days }
          }
        })
      }
    }
    
    // TODO: Send Email Notifications (Approved/Rejected)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: "Failed to update leave status" }
  }
}
