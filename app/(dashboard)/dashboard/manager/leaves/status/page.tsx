import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { Clock, CheckCircle2, User, Building2, UserCog } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LeaveStatusPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  const activeLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: session.user.employeeId,
      status: {
        in: ["PENDING", "MANAGER_APPROVED", "HR_APPROVED"]
      }
    },
    include: {
      leaveType: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const getStatusSteps = (status: string) => {
    return [
      { 
        id: "PENDING", 
        name: "รอหัวหน้าอนุมัติ", 
        icon: User,
        completed: ["MANAGER_APPROVED", "HR_APPROVED", "CEO_APPROVED", "APPROVED"].includes(status),
        current: status === "PENDING"
      },
      { 
        id: "MANAGER_APPROVED", 
        name: "รอ HR ตรวจสอบ", 
        icon: Building2,
        completed: ["HR_APPROVED", "CEO_APPROVED", "APPROVED"].includes(status),
        current: status === "MANAGER_APPROVED"
      },
      { 
        id: "HR_APPROVED", 
        name: "รอ CEO อนุมัติ", 
        icon: UserCog,
        completed: ["CEO_APPROVED", "APPROVED"].includes(status),
        current: status === "HR_APPROVED"
      },
      { 
        id: "CEO_APPROVED", 
        name: "อนุมัติสำเร็จ", 
        icon: CheckCircle2,
        completed: ["CEO_APPROVED", "APPROVED"].includes(status),
        current: false
      },
    ]
  }

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">สถานะการลา (Leave Status)</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">
              ตรวจสอบสถานะคำขอลาของคุณ
            </p>
          </div>
        </div>
        
        <div className="mx-auto mt-6 space-y-6 max-w-5xl">
          {/* Mock Leave Request Card (as requested from the form) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#f3f4f6] p-6 mx-6 mt-6 rounded-xl">
              <h3 className="text-xl font-bold text-black">ลาพักร้อน(5 วัน)</h3>
              <p className="text-sm text-gray-600 mt-1">13-18 เม.ย. 2570</p>
            </div>
            
            {/* Card Body - Timeline */}
            <div className="p-8 md:p-10 pl-12 relative">
              {/* Vertical Line */}
              <div className="absolute top-12 bottom-12 left-[3.3rem] w-0.5 bg-gray-200"></div>

              <div className="space-y-10 relative">
                {/* Step 1 */}
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-4 h-4 rounded-full bg-green-500 mt-1 relative z-10 ring-4 ring-white"></div>
                  <div className="w-full">
                    <h4 className="font-bold text-black text-lg">ส่งคำขอสำเร็จ</h4>
                    <p className="text-sm text-gray-500 mb-2">29 มี.ค. 2570, 09.30 น.</p>
                    <div className="bg-[#f3f4f6] text-gray-600 text-sm p-4 rounded-lg w-full">
                      พนักงานยื่นคำขอลาพักร้อนผ่านระบบเรียบร้อยแล้ว
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-4 h-4 rounded-full bg-[#00B4D8] mt-1 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <h4 className="font-bold text-black text-lg">รออนุมัติจาก Manager</h4>
                    <p className="text-sm text-gray-500">ผู้พิจารณา: คุณสมเกียรติ (Head of Engineering)</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex items-start gap-6 opacity-40">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mt-1 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <h4 className="font-bold text-gray-500 text-lg">รออนุมัติจาก HR</h4>
                    <p className="text-sm text-gray-400">รอการพิจารณาตาม Workflow</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex items-start gap-6 opacity-40">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mt-1 relative z-10 ring-4 ring-white"></div>
                  <div>
                    <h4 className="font-bold text-gray-500 text-lg">เสร็จสิ้น (Completed)</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {activeLeaves.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">ไม่มีคำขอลาที่กำลังดำเนินการ</h3>
              <p className="text-gray-500 mt-2">คำขอลาทั้งหมดของคุณได้รับการอนุมัติหรือปฏิเสธแล้ว</p>
            </div>
          ) : (
            activeLeaves.map((leave: any) => {
              const steps = getStatusSteps(leave.status)
              
              return (
                <Card key={leave.id} className="rounded-2xl border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {leave.leaveType.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              ยื่นเมื่อ {format(new Date(leave.createdAt), "dd MMM yyyy", { locale: th })}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#0B0F4E] mt-3">
                            {format(new Date(leave.startDate), "dd MMM yyyy", { locale: th })} - {format(new Date(leave.endDate), "dd MMM yyyy", { locale: th })}
                          </h3>
                          <p className="text-gray-600 mt-1">จำนวน {leave.days} วัน</p>
                          <p className="text-gray-500 mt-2 text-sm italic">"{leave.reason}"</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 md:p-8">
                      <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full hidden md:block"></div>
                        
                        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                          {steps.map((step, index) => {
                            const Icon = step.icon
                            let bgColor = "bg-white border-2 border-gray-200 text-gray-400"
                            if (step.completed) bgColor = "bg-green-500 border-2 border-green-500 text-white"
                            if (step.current) bgColor = "bg-[#0B0F4E] border-2 border-[#0B0F4E] text-white ring-4 ring-blue-100"
                            
                            return (
                              <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group">
                                {/* Mobile line connector */}
                                {index !== steps.length - 1 && (
                                  <div className="absolute left-[1.125rem] top-10 bottom-[-1.5rem] w-0.5 bg-gray-200 md:hidden"></div>
                                )}
                                
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${bgColor}`}>
                                  {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <div className="text-left md:text-center">
                                  <p className={`text-sm font-bold ${step.current ? 'text-[#0B0F4E]' : step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                    {step.name}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
