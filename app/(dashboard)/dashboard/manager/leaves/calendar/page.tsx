import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarView } from "./calendar-view"

export const dynamic = "force-dynamic"

export default async function LeaveCalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">ปฏิทินวันลา (Leave Calendar)</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">
              ดูวันลาของพนักงานในรูปแบบปฏิทิน
            </p>
          </div>
        </div>
        
        <div className="mx-auto mt-6">
          <CalendarView />
        </div>
      </div>
    </div>
  )
}
