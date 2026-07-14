import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { LeaveHistoryClient } from "./client"

export const dynamic = "force-dynamic"

export default async function MyLeavesPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  const [leaves, leaveTypes] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: {
        employeeId: session.user.employeeId,
      },
      include: {
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.leaveType.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return <LeaveHistoryClient initialLeaves={leaves} leaveTypes={leaveTypes} />
}
