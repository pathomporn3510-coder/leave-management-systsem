"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { notifyRole } from "@/lib/notifications"

const createLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  startLeaveFormat: z.string(),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
  endLeaveFormat: z.string(),
  reason: z.string().min(1, "กรุณาระบุเหตุผล"),
})

export async function createLeaveRequest(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !session.user.employeeId) {
    return { error: "Unauthorized" }
  }

  const rawData = {
    leaveTypeId: formData.get("leaveTypeId") as string,
    startDate: formData.get("startDate") as string,
    startLeaveFormat: formData.get("startLeaveFormat") as string,
    endDate: formData.get("endDate") as string,
    endLeaveFormat: formData.get("endLeaveFormat") as string,
    reason: formData.get("reason") as string,
  }

  const validatedData = createLeaveSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: "ข้อมูลไม่ถูกต้อง", details: validatedData.error.flatten() }
  }

  const { leaveTypeId, startDate, startLeaveFormat, endDate, endLeaveFormat, reason } = validatedData.data

  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start > end) {
    return { error: "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด" }
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  if (diffDays === 1) {
    if (startLeaveFormat !== "full") diffDays = 0.5
  } else {
    if (startLeaveFormat !== "full") diffDays -= 0.5
    if (endLeaveFormat !== "full") diffDays -= 0.5
  }

  try {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: session.user.employeeId,
        leaveTypeId,
        startDate: start,
        endDate: end,
        days: diffDays,
        reason,
        status: "PENDING"
      }
    })

    await prisma.leaveHistory.create({
      data: {
        leaveRequestId: leaveRequest.id,
        action: "CREATED",
        actorId: session.user.employeeId,
        comment: "ส่งคำขอลา"
      }
    })

    // Fetch employee details to format notification
    const employee = await prisma.employee.findUnique({
      where: { id: session.user.employeeId }
    })
    
    if (employee) {
      await notifyRole("MANAGER", `มีคำขอลาใหม่จากคุณ ${employee.firstName} ${employee.lastName}`)
    }

    revalidatePath("/dashboard/user/leaves/history")
    revalidatePath("/dashboard/user/leaves/status")
    
    return { success: true }
  } catch (error) {
    console.error("Error creating leave request:", error)
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
  }
}

export async function updateLeaveRequest(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !session.user.employeeId) {
    return { error: "Unauthorized" }
  }

  const id = formData.get("id") as string
  if (!id) return { error: "Leave ID is required" }

  const rawData = {
    leaveTypeId: formData.get("leaveTypeId") as string,
    startDate: formData.get("startDate") as string,
    startLeaveFormat: formData.get("startLeaveFormat") as string,
    endDate: formData.get("endDate") as string,
    endLeaveFormat: formData.get("endLeaveFormat") as string,
    reason: formData.get("reason") as string,
  }

  const validatedData = createLeaveSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: "ข้อมูลไม่ถูกต้อง", details: validatedData.error.flatten() }
  }

  const { leaveTypeId, startDate, startLeaveFormat, endDate, endLeaveFormat, reason } = validatedData.data

  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start > end) {
    return { error: "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด" }
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  if (diffDays === 1) {
    if (startLeaveFormat !== "full") diffDays = 0.5
  } else {
    if (startLeaveFormat !== "full") diffDays -= 0.5
    if (endLeaveFormat !== "full") diffDays -= 0.5
  }

  try {
    // Make sure leave belongs to user and is pending
    const existing = await prisma.leaveRequest.findUnique({ where: { id } })
    if (!existing || existing.employeeId !== session.user.employeeId) {
      return { error: "ไม่พบข้อมูลคำขอลา" }
    }
    
    if (existing.status !== "PENDING") {
      return { error: "ไม่สามารถแก้ไขคำขอลาที่ถูกดำเนินการไปแล้วได้" }
    }

    await prisma.leaveRequest.update({
      where: { id },
      data: {
        leaveTypeId,
        startDate: start,
        endDate: end,
        days: diffDays,
        reason,
      }
    })

    await prisma.leaveHistory.create({
      data: {
        leaveRequestId: id,
        action: "UPDATED",
        actorId: session.user.employeeId,
        comment: "แก้ไขข้อมูลคำขอลา"
      }
    })

    revalidatePath("/dashboard/user/leaves/history")
    revalidatePath("/dashboard/user/leaves/status")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating leave request:", error)
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
  }
}

export async function deleteLeaveRequest(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !session.user.employeeId) {
    return { error: "Unauthorized" }
  }

  try {
    const existing = await prisma.leaveRequest.findUnique({ where: { id } })
    if (!existing || existing.employeeId !== session.user.employeeId) {
      return { error: "ไม่พบข้อมูลคำขอลา" }
    }
    
    if (existing.status !== "PENDING") {
      return { error: "ไม่สามารถลบคำขอลาที่ถูกดำเนินการไปแล้วได้" }
    }

    await prisma.leaveRequest.delete({
      where: { id }
    })

    revalidatePath("/dashboard/user/leaves/history")
    revalidatePath("/dashboard/user/leaves/status")
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting leave request:", error)
    return { error: "เกิดข้อผิดพลาดในการลบข้อมูล" }
  }
}
