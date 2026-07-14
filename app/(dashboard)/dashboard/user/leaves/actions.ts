"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
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
    endDate: formData.get("endDate") as string,
    reason: formData.get("reason") as string,
  }

  const validatedData = createLeaveSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: "ข้อมูลไม่ถูกต้อง", details: validatedData.error.flatten() }
  }

  const { leaveTypeId, startDate, endDate, reason } = validatedData.data

  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start > end) {
    return { error: "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด" }
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

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

    revalidatePath("/dashboard/user/leaves/my")
    revalidatePath("/dashboard/user/leaves/status")
    
    return { success: true }
  } catch (error) {
    console.error("Error creating leave request:", error)
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
  }
}
