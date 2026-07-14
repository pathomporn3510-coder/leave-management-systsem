import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { CalendarView } from "./calendar-view"

export const dynamic = "force-dynamic"

export default async function LeaveCalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  // Get leaves for the current year
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31)

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: session.user.employeeId,
      status: {
        not: "REJECTED"
      },
      startDate: {
        gte: startOfYear
      },
      endDate: {
        lte: endOfYear
      }
    },
    include: {
      leaveType: true,
    }
  })

  // Format leaves for the calendar client component
  const formattedLeaves = leaves.map((leave: any) => ({
    id: leave.id,
    title: leave.leaveType.name,
    start: leave.startDate.toISOString(),
    end: leave.endDate.toISOString(),
    status: leave.status,
  }))

  return (
    <div className="flex-col bg-[#cfcfcf] min-h-screen pb-12">
      <div className="flex-1 p-4 md:p-12 max-w-[1200px] mx-auto">
        <CalendarView leaves={formattedLeaves} />
      </div>
    </div>
  )
}
