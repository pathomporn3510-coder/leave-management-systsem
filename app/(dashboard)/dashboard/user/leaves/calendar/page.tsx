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
  const formattedLeaves = leaves.map(leave => ({
    id: leave.id,
    title: leave.leaveType.name,
    start: leave.startDate.toISOString(),
    end: leave.endDate.toISOString(),
    status: leave.status,
  }))

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="rounded-2xl bg-[#0B0F4E] p-8 text-white">
          <h2 className="text-3xl font-bold tracking-tight">ปฏิทินวันลา</h2>
          <p className="text-[#8890B5] mt-2 text-lg">
            ดูวันลาของคุณในรูปแบบปฏิทิน
          </p>
        </div>
        
        <div className="mx-auto mt-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
            <CalendarView leaves={formattedLeaves} />
          </div>
        </div>
      </div>
    </div>
  )
}
