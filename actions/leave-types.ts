"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const leaveTypeSchema = z.object({
  name: z.string().min(2, "Leave type name is required"),
  defaultDays: z.number().min(0, "Default days must be positive"),
})

export async function getLeaveTypes() {
  return await prisma.leaveType.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createLeaveType(data: z.infer<typeof leaveTypeSchema>) {
  try {
    const validated = leaveTypeSchema.parse(data)
    await prisma.leaveType.create({
      data: { 
        name: validated.name,
        defaultDays: validated.defaultDays
      }
    })
    revalidatePath("/dashboard/hr/leave-types")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create leave type" }
  }
}

export async function deleteLeaveType(id: string) {
  try {
    await prisma.leaveType.delete({
      where: { id }
    })
    revalidatePath("/dashboard/hr/leave-types")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete leave type" }
  }
}
