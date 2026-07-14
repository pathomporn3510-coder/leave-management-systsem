import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { User, Building2, Briefcase, Mail, Fingerprint, CalendarDays } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  const currentYear = new Date().getFullYear()

  const employee = await prisma.employee.findUnique({
    where: { id: session.user.employeeId },
    include: {
      department: true,
      position: true,
      user: true,
      leaveBalances: {
        where: { year: currentYear },
        include: { leaveType: true }
      }
    }
  })

  if (!employee) {
    return <div>Employee not found</div>
  }

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="rounded-2xl bg-[#0B0F4E] p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-xl">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">{employee.firstName} {employee.lastName}</h2>
              <p className="text-[#8890B5] mt-1 text-lg flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-5 h-5" /> {employee.position.name}
              </p>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Profile Info */}
          <Card className="md:col-span-1 rounded-2xl border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#0B0F4E] mb-6 flex items-center gap-2">
                <User className="w-5 h-5" /> ข้อมูลส่วนตัว
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Fingerprint className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">รหัสพนักงาน</p>
                    <p className="font-semibold text-gray-800">{employee.employeeCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">แผนก</p>
                    <p className="font-semibold text-gray-800">{employee.department.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">อีเมล</p>
                    <p className="font-semibold text-gray-800">{employee.user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Balances */}
          <Card className="md:col-span-2 rounded-2xl border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#0B0F4E] mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" /> โควตาวันลาประจำปี {currentYear}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employee.leaveBalances.length === 0 ? (
                  <p className="text-gray-500 italic col-span-2">ยังไม่มีข้อมูลโควตาวันลาในปีนี้</p>
                ) : (
                  employee.leaveBalances.map((balance: any) => {
                    const remaining = balance.totalDays - balance.usedDays
                    const percentUsed = Math.min(100, Math.round((balance.usedDays / balance.totalDays) * 100))
                    
                    let progressColor = "bg-blue-500"
                    if (percentUsed > 80) progressColor = "bg-red-500"
                    else if (percentUsed > 50) progressColor = "bg-yellow-500"
                    
                    return (
                      <div key={balance.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-gray-700">{balance.leaveType.name}</h4>
                          <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                            เหลือ {remaining} วัน
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 mt-4 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${progressColor} transition-all duration-500`} 
                            style={{ width: `${percentUsed}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>ใช้ไป {balance.usedDays} วัน</span>
                          <span>ทั้งหมด {balance.totalDays} วัน</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
