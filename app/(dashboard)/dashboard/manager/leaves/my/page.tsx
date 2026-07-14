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
import { CalendarIcon } from "lucide-react"
import Link from "next/link"
import { MockCalendarFilter } from "@/components/mock-calendar-filter"
import { ViewDetailsButton } from "@/components/view-details-button"
import { getMockLeaves } from "@/actions/mock-leaves"

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

  const mockLeaves = await getMockLeaves()

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">ประวัติการลา (Leave History)</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">
              ดูประวัติและสถานะการลาของคุณทั้งหมด
            </p>
          </div>
        </div>
        
        <div className="mx-auto mt-6 max-w-6xl">
          {/* Controls above table */}
          <div className="flex justify-between items-end mb-4 px-2">
            <MockCalendarFilter />
            <Link href="/dashboard/manager/leaves/department" className="text-sm text-gray-700 cursor-pointer hover:underline font-medium">
              ดูประวัติการลาของแผนก
            </Link>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-md border-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#D0EBF2]">
                <TableRow className="border-b-0 hover:bg-[#D0EBF2]">
                  <TableHead className="w-[180px]"></TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">ประเภทการลา</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">จำนวนวันลา</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">เหตุผล</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">สถานะ</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaves.map((leave) => (
                  <TableRow key={leave.id} className="hover:bg-gray-50/50 border-b-0">
                    <TableCell className="font-medium text-gray-700 py-5 pl-8">
                      {leave.dateStr}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">{leave.type}</TableCell>
                    <TableCell className="text-center text-gray-700">{leave.days}</TableCell>
                    <TableCell className="text-center text-gray-700">{leave.reason}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${leave.statusColor} text-white border-0 hover:opacity-90 font-medium px-3 py-1 rounded-md`}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ViewDetailsButton leave={leave} isPersonal={true} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
