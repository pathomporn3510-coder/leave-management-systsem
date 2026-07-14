import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { th } from "date-fns/locale"

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

  // Mock data matching Figma design
  const mockLeaves = [
    {
      id: "mock-1",
      leaveType: { name: "ลาพักร้อน" },
      startDate: new Date("2027-04-13"),
      endDate: new Date("2027-04-18"),
      days: 5,
      status: "PENDING",
      createdAt: new Date("2027-03-29T09:30:00"),
      reason: "พักผ่อนประจำปี",
    }
  ]

  // Use actual database data only
  const displayLeaves = activeLeaves

  const formatLeaveDateRange = (start: Date, end: Date) => {
    // If same month and year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${format(start, "d")}-${format(end, "d MMM yyyy", { locale: th })}`
    }
    return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy", { locale: th })}`
  }

  const getStatusSteps = (leave: any) => {
    const status = leave.status;
    return [
      { 
        id: "SUBMITTED", 
        name: "ส่งคำขอสำเร็จ", 
        description: `พนักงานยื่นคำขอ${leave.leaveType.name}ผ่านระบบเรียบร้อยแล้ว`,
        date: format(new Date(leave.createdAt), "dd MMM yyyy HH:mm น.", { locale: th }),
        state: "completed", 
      },
      { 
        id: "PENDING", 
        name: "รออนุมัติจาก Manager", 
        description: "ผู้พิจารณา: คุณสมเกียรติ (Head of Engineering)",
        state: status === "PENDING" ? "current" : (["MANAGER_APPROVED", "HR_APPROVED", "CEO_APPROVED", "APPROVED"].includes(status) ? "completed" : "upcoming"), 
      },
      { 
        id: "MANAGER_APPROVED", 
        name: "รออนุมัติจาก HR", 
        description: "รอการพิจารณาตาม Workflow",
        state: status === "MANAGER_APPROVED" ? "current" : (["HR_APPROVED", "CEO_APPROVED", "APPROVED"].includes(status) ? "completed" : "upcoming"),
      },
      { 
        id: "COMPLETED", 
        name: "เสร็จสิ้น (Completed)", 
        description: "",
        state: ["HR_APPROVED", "CEO_APPROVED", "APPROVED"].includes(status) ? "completed" : "upcoming",
      },
    ]
  }

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen pb-12">
      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
        
        {/* Top Header Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 px-6 md:px-8 flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">ตรวจสอบสถานะการลา</h2>
        </div>

        <div className="space-y-8 mt-4">
          {displayLeaves.map((leave: any) => {
            const steps = getStatusSteps(leave)
            
            return (
              <div key={leave.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-[#F3F4F6] p-6 md:px-10">
                  <h3 className="text-xl font-bold text-gray-900">{leave.leaveType.name}({leave.days} วัน)</h3>
                  <p className="text-gray-600 mt-1 text-sm">{formatLeaveDateRange(new Date(leave.startDate), new Date(leave.endDate))}</p>
                </div>
                
                {/* Timeline Body */}
                <div className="p-8 md:px-12 md:py-10">
                  <div className="relative border-l-2 border-gray-300 ml-2 space-y-12">
                    {steps.map((step, index) => {
                      // Adjusting dot position to perfectly align with the border
                      const dotClasses = 
                        step.state === 'completed' ? 'bg-[#10B981]' : 
                        step.state === 'current' ? 'bg-[#06B6D4]' : 
                        'bg-[#F3F4F6] border-2 border-gray-200';
                        
                      return (
                        <div key={step.id} className="relative pl-10">
                          {/* Dot */}
                          <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${dotClasses}`} />
                          
                          {/* Content */}
                          <div className="-mt-0.5">
                            <h4 className={`text-lg font-bold ${
                                step.state === 'upcoming' ? 'text-gray-300' : 'text-gray-900'
                              }`}>{step.name}</h4>
                            
                            {step.date && step.state !== 'upcoming' && (
                              <div className="mt-1 mb-3">
                                <span className="text-[#0ea5e9] text-sm border-b border-[#0ea5e9] pb-0.5">{step.date}</span>
                              </div>
                            )}
                            
                            {step.description && (
                              <div className={`mt-2 ${
                                  step.id === 'SUBMITTED' ? 'bg-[#F3F4F6] p-4 rounded-md w-full' : ''
                                }`}>
                                <p className={`text-sm ${
                                    step.state === 'upcoming' ? 'text-gray-200' : 'text-gray-500'
                                  }`}>{step.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
          {displayLeaves.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium">ไม่มีคำขอลาที่อยู่ระหว่างดำเนินการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
