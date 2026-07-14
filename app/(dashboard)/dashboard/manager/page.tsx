import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Overview } from "@/components/dashboard/overview"
import Link from "next/link"
import { CalendarDays, CheckCircle2, Clock, XCircle, Plus, ChevronDown, Mail, Bell, Settings, Users, UserMinus, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams
  const isDepartmentView = searchParams?.view === "department"

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch some summary stats
  let whereClause = {}
  if (session.user.role === "USER") {
    whereClause = { employeeId: session.user.employeeId }
  }

  const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves] = await Promise.all([
    prisma.leaveRequest.count({ where: whereClause }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "CEO_APPROVED" } }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "REJECTED" } }),
  ])

  // Mock data to match the design if no real data exists
  const displayRemaining = 8
  const displayPending = pendingLeaves > 0 ? pendingLeaves : 1
  const displayApproved = approvedLeaves > 0 ? approvedLeaves : 5
  const displayRejected = rejectedLeaves > 0 ? rejectedLeaves : 1

  // Mock data for Department View
  const displayDeptTotal = 8
  const displayDeptLeavesToday = 3
  const displayDeptRemaining = 3
  const displayDeptQuota = 1

  const userName = session.user.email?.split('@')[0] || "xxxxx xxxx"

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl bg-[#0B0F4E] p-8 text-white flex flex-col md:flex-row items-start justify-between gap-6 overflow-hidden">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">สวัสดี,ชื่อ {userName}</h2>
            <p className="text-[#8890B5] mt-2 text-lg">
              {isDepartmentView ? "ยินดีต้อนรับสู่ Dashboard ของแผนกคุณ" : "ยินดีต้อนรับสู่ Dashboard ของคุณ"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/manager/leaves/status">
                <Button variant="outline" className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-6 rounded-xl text-base border-0">
                  ตรวจสอบสถานะ
                </Button>
              </Link>
              <Link href="/dashboard/manager/leaves/new">
                <Button className="bg-[#2A2E5B] text-white hover:bg-[#343973] font-semibold px-6 py-6 rounded-xl text-base border border-[#3A3F7B]">
                  <Plus className="mr-2 h-8 w-6" />
                  ยื่นคำลา
                </Button>
              </Link>
            </div>
            <Link href={isDepartmentView ? "/dashboard/manager" : "/dashboard/manager?view=department"}>
              <p className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer mt-2">
                {isDepartmentView ? "ดู Dashboard ของคุณ" : "ดู Dashboard ของแผนก"}
              </p>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {isDepartmentView ? (
            <>
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">พนักงานทั้งหมด</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{displayDeptTotal}</span>
                        <span className="text-sm font-medium text-gray-500">คน</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserMinus className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">จำนวนการลาวันนี้</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{displayDeptLeavesToday}</span>
                        <span className="text-sm font-medium text-gray-500">คน</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">พนักงานคงเหลือ</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{displayDeptRemaining}</span>
                        <span className="text-sm font-medium text-gray-500">คน</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">โควต้าการลาในวันนี้</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{displayDeptQuota}</span>
                        <span className="text-sm font-medium text-gray-500">สิทธิ์</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">วันลาพักร้อนคงเหลือ</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{displayRemaining}</span>
                    <span className="text-sm font-medium text-gray-500">วัน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">รายการรออนุมัติ</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{displayPending}</span>
                    <span className="text-sm font-medium text-gray-500">รายการ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">อนุมัติแล้ว (ปีนี้)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{displayApproved}</span>
                    <span className="text-sm font-medium text-gray-500">รายการ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">คำขอที่ถูกปฏิเสธ</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{displayRejected}</span>
                    <span className="text-sm font-medium text-gray-500">รายการ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </>
          )}

        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-4">
          
          {/* Chart */}
          <Card className="lg:col-span-2 rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">สถิติการลารายเดือน</h3>
                <div className="flex items-center gap-1 bg-gray-200/50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 cursor-pointer">
                  ปี 2026 <ChevronDown className="h-3 w-3" />
                </div>
              </div>
              <Overview />
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="lg:col-span-1 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-[#121946] to-[#253282] text-white">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6">ประกาศบริษัท</h3>
              
              <div className="flex flex-col gap-4">
                <div className="bg-[#4162A5]/80 backdrop-blur-sm p-4 rounded-xl">
                  <h4 className="font-semibold text-sm">อัปเดตสวัสดิการ 2026</h4>
                  <p className="text-xs text-white/70 mt-1">เติมของกินให้แล้วเย้</p>
                </div>
                
                <div className="bg-[#4162A5]/80 backdrop-blur-sm p-4 rounded-xl">
                  <h4 className="font-semibold text-sm">อัปเดตด่วน!</h4>
                  <p className="text-xs text-white/70 mt-1">วันนี้ WFH ให้ทำงานที่พักตัวเอง</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-1 rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">กิจกรรมล่าสุด</h3>
              
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 mt-4">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-orange-400 border-2 border-white ring-4 ring-orange-50"></span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">ส่งคำขอลาพักร้อน 3 วัน</h4>
                    <p className="text-xs text-gray-400 mt-1">15 ชม. ที่แล้ว</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white ring-4 ring-green-50"></span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">หัวหน้าอนุมัติ</h4>
                    <p className="text-xs text-gray-400 mt-1">เมื่อวาน, 14:30</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50"></span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">ระบบอัปเดตสิทธิ์วันลาประจำปี</h4>
                    <p className="text-xs text-gray-400 mt-1">1 วันที่แล้ว</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
