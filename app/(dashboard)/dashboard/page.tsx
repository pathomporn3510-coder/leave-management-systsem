import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Overview } from "@/components/dashboard/overview"
import { CalendarDays, CheckCircle2, Clock, XCircle, Plus, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { th } from "date-fns/locale"

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "เมื่อครู่";
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
  if (diffDays === 1) return `เมื่อวานนี้ ${format(date, "HH:mm น.", { locale: th })}`;
  return format(date, "d MMM yyyy HH:mm น.", { locale: th });
}

function getFormattedActivity(activity: any) {
  const thLeaveNames: Record<string, string> = {
    "Annual Leave": "ลาพักร้อน",
    "Sick Leave": "ลาป่วย",
    "Personal Leave": "ลากิจ",
    "Ordination Leave": "ลาบวช",
    "Maternity Leave": "ลาคลอด"
  };
  const leaveName = thLeaveNames[activity.leaveRequest.leaveType.name] || activity.leaveRequest.leaveType.name;
  const days = activity.leaveRequest.days;
  const actorName = `${activity.actor.firstName} ${activity.actor.lastName}`;

  switch (activity.action) {
    case "CREATED":
      return `ส่งคำขอ${leaveName} ${days} วัน`;
    case "UPDATED":
      return `แก้ไขคำขอ${leaveName} ${days} วัน`;
    case "MANAGER_APPROVED":
      return `ผู้จัดการ (${actorName}) อนุมัติคำขอ`;
    case "HR_APPROVED":
      return `ฝ่ายบุคคล (${actorName}) อนุมัติคำขอ`;
    case "CEO_APPROVED":
      return `ผู้อนุมัติสุดท้าย (${actorName}) อนุมัติสำเร็จ`;
    case "REJECTED":
      return `คำขอลาปฏิเสธโดย (${actorName})`;
    case "CANCELLED":
      return `ยกเลิกคำขอลา`;
    default:
      return `${activity.comment || activity.action}`;
  }
}

function getActivityColors(action: string) {
  switch (action) {
    case "CREATED":
    case "UPDATED":
      return { dot: "bg-orange-400", ring: "ring-orange-50" };
    case "CEO_APPROVED":
    case "MANAGER_APPROVED":
    case "HR_APPROVED":
      return { dot: "bg-green-400", ring: "ring-green-50" };
    case "REJECTED":
    case "CANCELLED":
      return { dot: "bg-red-400", ring: "ring-red-50" };
    default:
      return { dot: "bg-blue-500", ring: "ring-blue-50" };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Redirect based on role
  if (session.user.role === "CEO") {
    redirect("/dashboard/ceo")
  }

  // Fetch some summary stats
  let whereClause = {}
  if (session.user.role === "USER") {
    whereClause = { employeeId: session.user.employeeId }
  }

  let historyWhere = {}
  if (session.user.role === "USER") {
    historyWhere = {
      leaveRequest: {
        employeeId: session.user.employeeId,
      },
    }
  }

  const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves, recentActivities] = await Promise.all([
    prisma.leaveRequest.count({ where: whereClause }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "CEO_APPROVED" } }),
    prisma.leaveRequest.count({ where: { ...whereClause, status: "REJECTED" } }),
    prisma.leaveHistory.findMany({
      where: historyWhere,
      include: {
        leaveRequest: {
          include: {
            leaveType: true,
          },
        },
        actor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })
  ])

  const userName = session.user.email?.split('@')[0] || "xxxxx xxxx"

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-[#0B0F4E] p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">สวัสดี,ชื่อ {userName}</h2>
            <p className="text-[#8890B5] mt-2 text-lg">
              ยินดีต้อนรับสู่ Dashboard ของคุณ
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-6 rounded-xl text-base border-0">
              ตรวจสอบสถานะ
            </Button>
            <Button className="bg-[#2A2E5B] text-white hover:bg-[#343973] font-semibold px-6 py-6 rounded-xl text-base border border-[#3A3F7B]">
              <Plus className="mr-2 h-5 w-5" />
              ยื่นคำลา
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">วันลาพักร้อนคงเหลือ</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">8</span>
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
                    <span className="text-5xl font-bold">{pendingLeaves}</span>
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
                    <span className="text-5xl font-bold">{approvedLeaves}</span>
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
                    <span className="text-5xl font-bold">{rejectedLeaves}</span>
                    <span className="text-sm font-medium text-gray-500">รายการ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Chart */}
          <Card className="md:col-span-1 lg:col-span-1 rounded-2xl border-0 shadow-sm">
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
          <Card className="md:col-span-1 lg:col-span-1 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-[#121946] to-[#253282] text-white">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6">ประกาศบริษัท</h3>
              
              <div className="flex flex-col gap-4">
                <div className="bg-[#4162A5]/80 backdrop-blur-sm p-4 rounded-xl">
                  <h4 className="font-semibold text-sm">อัปเดตสวัสดิการ 2026</h4>
                  <p className="text-xs text-white/70 mt-1">เต็มของกินให้แล้วเย้</p>
                </div>
                
                <div className="bg-[#4162A5]/80 backdrop-blur-sm p-4 rounded-xl">
                  <h4 className="font-semibold text-sm">อัปเดตด่วน!</h4>
                  <p className="text-xs text-white/70 mt-1">วันนี้ WFH ให้ทำงานที่พักตัวเอง</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-1 lg:col-span-1 rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">กิจกรรมล่าสุด</h3>
              
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 mt-4">
                {recentActivities.map((activity) => {
                  const colors = getActivityColors(activity.action);
                  return (
                    <div key={activity.id} className="relative">
                      <span className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full ${colors.dot} border-2 border-white ring-4 ${colors.ring}`}></span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{getFormattedActivity(activity)}</h4>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(new Date(activity.createdAt))}</p>
                      </div>
                    </div>
                  );
                })}
                {recentActivities.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">ไม่มีกิจกรรมล่าสุด</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
