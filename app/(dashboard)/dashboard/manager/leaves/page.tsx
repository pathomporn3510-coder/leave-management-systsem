import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MockCalendarFilter } from "@/components/mock-calendar-filter"
import { ManagerActionButtons } from "@/components/manager-action-buttons"

export const dynamic = "force-dynamic"

export default async function ManagerLeavesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "MANAGER") {
    redirect("/dashboard")
  }

  const mockData = [
    {
      id: "1",
      name: "สมศรี มณี",
      type: "ลาพักร้อน",
      date: "15-20 ก.ค. 2026",
      attachment: "-",
    },
    {
      id: "2",
      name: "สมคิด นึกไม่ออก",
      type: "ลาป่วย",
      date: "10 ก.ค. 2026",
      attachment: "-",
    },
    {
      id: "3",
      name: "สเตฟ่า ลักกี้",
      type: "ลากิจ",
      date: "5-6 ก.ค. 2026",
      attachment: "-",
    },
  ]

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8 md:p-10 max-w-6xl">
          
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">รายการคำขอรออนุมัติ (Manager View)</h2>
            <p className="text-gray-400 mt-1 text-sm">
              พิจารณาอนุมัติหรือปฏิเสธคำขอลาของพนักงานในแผนกของคุณ
            </p>
          </div>

          {/* Calendar Filter Button */}
          <div className="mb-8 relative inline-block z-10">
            <MockCalendarFilter />
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="text-gray-500 font-semibold py-4">ชื่อ-นามสกุล</TableHead>
                  <TableHead className="text-gray-500 font-semibold py-4">ประเภทวันลา</TableHead>
                  <TableHead className="text-gray-500 font-semibold py-4">วันเวลาที่ขอลา</TableHead>
                  <TableHead className="text-gray-500 font-semibold py-4">เอกสารแนบ</TableHead>
                  <TableHead className="text-gray-500 font-semibold text-right py-4 pr-12">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <TableCell className="font-bold text-gray-700 py-6">{item.name}</TableCell>
                    <TableCell className="text-gray-500">{item.type}</TableCell>
                    <TableCell className="text-gray-500">{item.date}</TableCell>
                    <TableCell className="text-gray-400">{item.attachment}</TableCell>
                    <TableCell className="text-right pr-6">
                      <ManagerActionButtons item={item} />
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
