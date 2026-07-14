import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function MyLeavesPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.employeeId) {
    redirect("/login")
  }

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: session.user.employeeId,
    },
    include: {
      leaveType: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
      case "MANAGER_APPROVED":
      case "HR_APPROVED":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">รอดำเนินการ</Badge>
      case "CEO_APPROVED":
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">อนุมัติแล้ว</Badge>
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">ปฏิเสธ</Badge>
      case "CANCELLED":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">ยกเลิก</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="rounded-2xl bg-[#0B0F4E] p-8 text-white">
          <h2 className="text-3xl font-bold tracking-tight">ประวัติการลา</h2>
          <p className="text-[#8890B5] mt-2 text-lg">
            ตรวจสอบประวัติคำขอลาที่ผ่านมาทั้งหมดของคุณ
          </p>
        </div>
        
        <div className="mx-auto mt-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-[150px] font-bold text-gray-700">วันที่ยื่นคำขอ</TableHead>
                    <TableHead className="font-bold text-gray-700">ประเภท</TableHead>
                    <TableHead className="font-bold text-gray-700">ตั้งแต่ - ถึง</TableHead>
                    <TableHead className="text-center font-bold text-gray-700">จำนวนวัน</TableHead>
                    <TableHead className="font-bold text-gray-700 w-[200px]">เหตุผล</TableHead>
                    <TableHead className="text-right font-bold text-gray-700">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        ยังไม่มีประวัติการลา
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaves.map((leave: any) => (
                      <TableRow key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium">
                          {format(new Date(leave.createdAt), "dd MMM yyyy", { locale: th })}
                        </TableCell>
                        <TableCell>{leave.leaveType.name}</TableCell>
                        <TableCell>
                          {format(new Date(leave.startDate), "dd MMM yy", { locale: th })} - {format(new Date(leave.endDate), "dd MMM yy", { locale: th })}
                        </TableCell>
                        <TableCell className="text-center font-semibold">{leave.days}</TableCell>
                        <TableCell className="truncate max-w-[200px]" title={leave.reason}>
                          {leave.reason}
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(leave.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
