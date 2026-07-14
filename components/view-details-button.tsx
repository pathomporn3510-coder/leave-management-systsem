"use client"

import { useState } from "react"
import { Eye, User, Calendar, FileText, Paperclip, Download, X, Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ViewDetailsButtonProps {
  leave: any
  isPersonal: boolean
  children?: React.ReactNode
}

export function ViewDetailsButton({ leave, isPersonal, children }: ViewDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Only personal leaves that are pending can be edited
  const canEdit = isPersonal && leave.status === "รออนุมัติ"

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={children ? "cursor-pointer inline-block" : "flex items-center gap-1.5 text-gray-600 hover:text-black cursor-pointer font-medium text-xs transition-colors justify-center"}
      >
        {children ? children : isPersonal ? (
          <span>ดูรายละเอียด</span>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span>ดูรายละเอียด</span>
          </>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Hide default close button with [&>button]:hidden */}
        <DialogContent className="sm:max-w-[700px] p-0 border-0 overflow-hidden bg-transparent shadow-none [&>button]:hidden" aria-describedby={undefined}>
          <DialogTitle className="sr-only">รายละเอียดคำขอลา</DialogTitle>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-black">รายละเอียดคำขอลา (Leave Request Details)</h2>
              <button onClick={() => setIsOpen(false)} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm">
                <X className="w-4 h-4" strokeWidth={3}/>
              </button>
            </div>
            
            {/* Employee Info Box */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white flex gap-4 shadow-sm items-start">
                <div className="bg-purple-100 p-2 rounded-full h-fit flex-shrink-0">
                  <User className="text-purple-500 w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-black">ข้อมูลพนักงาน (Employee Info)</h3>
                  <p className="text-sm text-gray-700"><span className="font-semibold text-black inline-block w-28">ชื่อ:</span> {leave.name || "สมคิด คิดไม่ออก"}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold text-black inline-block w-28">แผนก|ตำแหน่ง:</span> Engineering | Frontend Developer</p>
                </div>
            </div>

            {/* Leave Info Box */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
                <div className="flex gap-4 mb-4 items-center">
                  <div className="bg-blue-100 p-2 rounded-full h-fit flex-shrink-0">
                    <Calendar className="text-blue-500 w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-black">รายละเอียดการลา (Leave Information)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-[3.25rem]">
                  <div className="space-y-4 border-r border-gray-100 pr-4">
                      <p className="text-sm text-gray-700"><span className="font-semibold text-black inline-block w-28">ประเภทการลา:</span> {leave.type}</p>
                      <p className="text-sm text-gray-700"><span className="font-semibold text-black inline-block w-28">ช่วงเวลา:</span> {leave.dateStr} ({leave.days})</p>
                  </div>
                  <div className="space-y-3 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full"><FileText className="text-green-500 w-4 h-4" /></div>
                        <span className="text-sm text-gray-700"><span className="font-semibold text-black mr-2">รูปแบบการลา:</span> เต็มวัน</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-1">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-1.5 rounded-full"><Paperclip className="text-yellow-500 w-4 h-4" /></div>
                          <span className="text-sm text-gray-700"><span className="font-semibold text-black mr-2">เอกสารแนบ:</span> -</span>
                        </div>
                        <button className="border border-gray-300 rounded p-1 hover:bg-gray-100 transition-colors shadow-sm bg-white"><Download className="w-4 h-4 text-gray-600" /></button>
                      </div>
                  </div>
                </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <h3 className="font-bold text-sm text-black mb-2">เหตุผลการลา</h3>
              <div className="border border-gray-300 rounded-md p-3 text-sm text-gray-500 bg-white">
                {leave.reason || "ลาไปต่างจังหวัด"}
              </div>
            </div>

            {/* Approval Info */}
            <div className="mb-6">
              <div className="flex gap-2 items-center mb-2">
                <span className="font-bold text-green-600 text-sm flex items-center gap-1">
                  <span className="text-gray-400 font-normal border border-gray-300 px-1 text-[10px] rounded mr-1">NID</span> การอนุมัติ (Approval)
                </span>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex items-center justify-between gap-6">
                <div className="flex flex-col gap-2 w-1/3 border-r border-gray-300 pr-4">
                  <span className="text-xs font-semibold text-black">สถานะ:</span>
                  <div className="flex justify-center">
                    <Badge className={`${leave.statusColor} text-white hover:opacity-90 w-fit px-6 shadow-sm border-0`}>{leave.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-2/3">
                  <span className="text-xs font-semibold text-black whitespace-nowrap">เหตุผลของผู้อนุมัติ</span>
                  <input type="text" disabled value="------------" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-400" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400 font-medium">วันที่ยื่นคำขอ : 30 มิ.ย. 2569 เวลา 10:30 น.</div>
              {canEdit && (
                <button 
                  onClick={() => router.push(`/dashboard/manager/leaves/new?edit=1&id=${leave.id || 1}&type=${encodeURIComponent(leave.type)}&reason=${encodeURIComponent(leave.reason || "ลาไปต่างจังหวัด")}`)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 text-sm font-bold transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> แก้ไขข้อมูล
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
