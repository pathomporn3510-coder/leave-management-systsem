import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Eye } from "lucide-react"
import Link from "next/link"
import { MockCalendarFilter } from "@/components/mock-calendar-filter"
import { ViewDetailsButton } from "@/components/view-details-button"
import { ExportCsvButton } from "@/components/export-csv-button"

export const dynamic = "force-dynamic"

export default async function DepartmentLeavesPage() {
  const mockLeaves = [
    { id: 1, empId: "EMP-014", name: "สมจิตร จิตอาสา", dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", status: "รออนุมัติ", statusColor: "bg-amber-500 hover:bg-amber-600" },
    { id: 2, empId: "EMP-013", name: "สมจิตร จิตอาสา", dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", status: "ปฏิเสธ", statusColor: "bg-red-500 hover:bg-red-600" },
    { id: 3, empId: "EMP-011", name: "สมจิตร จิตอาสา", dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
    { id: 4, empId: "EMP-015", name: "สมจิตร จิตอาสา", dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
    { id: 5, empId: "EMP-015", name: "สมจิตร จิตอาสา", dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
  ]

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">ประวัติการลา (Leave History)</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">
              ดูประวัติและสถานะการลาของแผนก
            </p>
          </div>
        </div>
        
        <div className="mx-auto mt-6 max-w-6xl">
          {/* Controls above table */}
          <div className="flex justify-between items-end mb-4 px-2">
            <MockCalendarFilter />
            <Link href="/dashboard/manager/leaves/my" className="text-sm text-gray-700 cursor-pointer hover:underline font-medium">
              ดูประวัติการลาของส่วนตัว
            </Link>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-md border-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#D0EBF2]">
                <TableRow className="border-b-0 hover:bg-[#D0EBF2]">
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center w-[150px]">รหัสพนักงาน</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">ชื่อพนักงาน</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">วันที่ลา</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">ประเภทการลา</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center">จำนวนวันลา</TableHead>
                  <TableHead className="font-bold text-gray-800 text-base py-4 text-center w-[180px]">สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaves.map((leave) => (
                  <TableRow key={leave.id} className="hover:bg-gray-50/50 border-b-0">
                    <TableCell className="font-medium text-gray-500 py-5 text-center">
                      {leave.empId}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">{leave.name}</TableCell>
                    <TableCell className="text-center text-gray-700">{leave.dateStr}</TableCell>
                    <TableCell className="text-center text-gray-700">{leave.type}</TableCell>
                    <TableCell className="text-center text-gray-700">{leave.days}</TableCell>
                    <TableCell className="text-center align-middle">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Badge className={`${leave.statusColor} text-white border-0 hover:opacity-90 font-medium px-4 py-1 rounded-md w-24 flex justify-center shadow-sm`}>
                          {leave.status}
                        </Badge>
                        <ViewDetailsButton leave={leave} isPersonal={false} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-4 px-2 pb-6">
            <ExportCsvButton data={mockLeaves} filename="department_leave_history.csv" />
          </div>
        </div>
      </div>
    </div>
  )
}
