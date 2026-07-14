"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
})

export async function getDepartments() {
  return await prisma.department.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createDepartment(data: z.infer<typeof departmentSchema>) {
  try {
    const validated = departmentSchema.parse(data)
    await prisma.department.create({
      data: { name: validated.name }
    })
    revalidatePath("/dashboard/hr/departments")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create department" }
  }
}

export async function deleteDepartment(id: string) {
  try {
    await prisma.department.delete({
      where: { id }
    })
    revalidatePath("/dashboard/hr/departments")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete department" }
  }
}
