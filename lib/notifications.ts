import prisma from "./prisma"
import { Role } from "@prisma/client"

/**
 * Creates a notification for a specific user
 */
export async function createNotification(userId: string, message: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        message,
      }
    })
  } catch (error) {
    console.error("Failed to create notification:", error)
  }
}

/**
 * Creates notifications for all users with a specific role
 */
export async function notifyRole(role: Role, message: string) {
  try {
    const users = await prisma.user.findMany({
      where: { role }
    })
    
    if (users.length > 0) {
      const notifications = users.map(user => ({
        userId: user.id,
        message,
      }))
      
      await prisma.notification.createMany({
        data: notifications
      })
    }
  } catch (error) {
    console.error(`Failed to notify role ${role}:`, error)
  }
}

/**
 * Specifically notifies a manager of a department
 * If no specific manager logic is set, it falls back to notifying all users with MANAGER role for simplicity,
 * or it could look up the department head.
 */
export async function notifyManager(departmentId: string, message: string) {
  // In a full implementation, you might want to find the exact manager for this department.
  // For now, we will notify all managers.
  await notifyRole("MANAGER", message)
}
