import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getLeaveRequests } from "@/actions/leaves"
import { Overview } from "@/components/dashboard/overview"
import { CalendarDays, Clock, CheckCircle2, XCircle, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardClient } from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function CEODashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CEO") {
    redirect("/dashboard")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endOfToday = new Date(today)
  endOfToday.setHours(23, 59, 59, 999)

  const [totalEmployees, leavesTodayCount, pendingRequests, recentRequests] = await Promise.all([
    prisma.employee.count(),
    prisma.leaveRequest.count({
      where: {
        status: "CEO_APPROVED",
        startDate: { lte: endOfToday },
        endDate: { gte: today }
      }
    }),
    getLeaveRequests("CEO"), // Gets all pending requests for CEO (status: "HR_APPROVED")
    prisma.leaveRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        employee: {
          include: { department: true }
        },
        leaveType: true
      }
    })
  ])

  const readyEmployees = totalEmployees - leavesTodayCount
  const userName = session.user.email?.split('@')[0] || "CEO"

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0B0F4E] to-[#1A237E] p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-20 -mb-10 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight mb-1">สวัสดี คุณ CEO</h2>
            <p className="text-[#8890B5] text-lg font-medium">
              ยินดีต้อนรับสู่ Dashboard ของคุณ
            </p>
            <h3 className="text-xl font-semibold mt-6 text-white/90">ภาพรวมสถานะการลาและการบริหารพนักงาน</h3>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">พนักงานในระบบทั้งหมด</p>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-5xl font-bold text-gray-900">{totalEmployees}</span>
                    <span className="text-sm font-medium text-gray-500">คน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">จำนวนการลาวันนี้</p>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-5xl font-bold text-gray-900">{leavesTodayCount}</span>
                    <span className="text-sm font-medium text-gray-500">คน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">รายการรออนุมัติ</p>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-5xl font-bold text-gray-900">{pendingRequests.length}</span>
                    <span className="text-sm font-medium text-gray-500">คน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">พนักงานพร้อมปฏิบัติงาน</p>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-5xl font-bold text-gray-900">{readyEmployees}</span>
                    <span className="text-sm font-medium text-gray-500">คน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          
          {/* Chart */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">สถิติการลารายเดือน</h3>
                <div className="flex items-center gap-1 bg-gray-200/50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors">
                  ปี 2026 <ChevronDown className="h-3 w-3" />
                </div>
              </div>
              <Overview />
            </CardContent>
          </Card>

          {/* Recent Pending Table */}
          <Card className="rounded-2xl border-0 shadow-sm flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">รายการคำขอล่าสุด</h3>
              </div>
              <DashboardClient data={recentRequests} />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
