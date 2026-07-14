"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const positionSchema = z.object({
  name: z.string().min(2, "Position name is required"),
})

export async function getPositions() {
  return await prisma.position.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createPosition(data: z.infer<typeof positionSchema>) {
  try {
    const validated = positionSchema.parse(data)
    await prisma.position.create({
      data: { name: validated.name }
    })
    revalidatePath("/dashboard/hr/positions")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create position" }
  }
}

export async function deletePosition(id: string) {
  try {
    await prisma.position.delete({
      where: { id }
    })
    revalidatePath("/dashboard/hr/positions")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete position" }
  }
}
