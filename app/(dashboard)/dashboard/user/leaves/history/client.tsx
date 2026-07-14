"use client"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon, User, FileText, Paperclip, Download, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateLeaveRequest, deleteLeaveRequest } from "../actions"

export function LeaveHistoryClient({ initialLeaves, leaveTypes = [] }: { initialLeaves: any[], leaveTypes?: any[] }) {
  // Mock data matching Figma design
  const mockLeaves = [
    { id: 'mock-1', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลาพักร้อน' }, days: 3, reason: 'ไปพักผ่อน', status: 'PENDING', createdAt: new Date() },
    { id: 'mock-2', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'APPROVED', createdAt: new Date() },
    { id: 'mock-3', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'APPROVED', createdAt: new Date() },
    { id: 'mock-4', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 1, reason: 'ไปเที่ยวสยาม', status: 'REJECTED', createdAt: new Date() },
    { id: 'mock-5', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'APPROVED', createdAt: new Date() },
    { id: 'mock-6', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'APPROVED', createdAt: new Date() },
    { id: 'mock-7', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'REJECTED', createdAt: new Date() },
    { id: 'mock-8', startDate: new Date('2026-07-17'), endDate: new Date('2026-07-19'), leaveType: { name: 'ลากิจ' }, days: 3, reason: 'ไปทำใบขับขี่', status: 'APPROVED', createdAt: new Date() },
  ]

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", 
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", 
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ]
  const currentMonthName = months[new Date().getMonth()]
  const currentYearBe = (new Date().getFullYear() + 543).toString()

  const displayLeaves = initialLeaves

  const router = useRouter()
  const [editingLeave, setEditingLeave] = useState<any>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName)
  const [selectedYear, setSelectedYear] = useState(currentYearBe)

  const currentYear = new Date().getFullYear() + 543
  const years = Array.from({ length: 21 }, (_, i) => (currentYear - 10 + i).toString())

  const filteredLeaves = displayLeaves.filter((leave) => {
    const start = new Date(leave.startDate)
    const end = new Date(leave.endDate)
    const ceYear = parseInt(selectedYear) - 543
    const selectedMonthIdx = months.indexOf(selectedMonth)

    const selectedMonthStart = new Date(ceYear, selectedMonthIdx, 1)
    const selectedMonthEnd = new Date(ceYear, selectedMonthIdx + 1, 0, 23, 59, 59, 999)

    return start <= selectedMonthEnd && end >= selectedMonthStart
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
      case "MANAGER_APPROVED":
      case "HR_APPROVED":
        return <span className="bg-[#f5a623] text-white px-3 py-1 rounded-full text-xs font-medium">รออนุมัติ</span>
      case "CEO_APPROVED":
      case "APPROVED":
        return <span className="bg-[#10b981] text-white px-3 py-1 rounded-full text-xs font-medium">อนุมัติ</span>
      case "REJECTED":
      case "CANCELLED":
        return <span className="bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-medium">ปฏิเสธ</span>
      default:
        return <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-medium">{status}</span>
    }
  }

  const formatLeaveDateRange = (start: Date, end: Date) => {
    const startDay = format(start, "d")
    const endDay = format(end, "d")
    const endMonth = format(end, "MMM", { locale: th })
    const endYearBe = end.getFullYear() + 543
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${startDay}-${endDay} ${endMonth} ${endYearBe}`
    } else {
      const startMonth = format(start, "MMM", { locale: th })
      const startYearBe = start.getFullYear() + 543
      return `${startDay} ${startMonth} ${startYearBe} - ${endDay} ${endMonth} ${endYearBe}`
    }
  }

  if (editingLeave) {
    return (
      <div className="flex-col bg-[#cfcfcf] min-h-screen pb-12">
        <div className="flex-1 p-4 md:p-12 max-w-[1200px] mx-auto relative">
          
          {/* Top Header Bar */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,100,255,0.3)] border-2 border-blue-500 p-4 px-6 md:px-8 flex items-center justify-between mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
            <div className="pl-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">แบบฟอร์มยื่นลา (Leave Request)</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อส่งให้หัวหน้างานอนุมัติ</p>
            </div>
          </div>

          {/* Form Content */}
          <form 
            ref={formRef}
            action={async (formData) => {
              formData.append("id", editingLeave.id)
              const result = await updateLeaveRequest(formData)
              if (result?.success) {
                setShowConfirmDialog(false)
                setEditingLeave(null)
                router.refresh()
              } else {
                alert(result?.error || "เกิดข้อผิดพลาด")
              }
            }}
            className="bg-white rounded-xl shadow-sm p-6 md:p-10"
          >
            {/* Gray box */}
            <div className="bg-[#f2f2f2] rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-700 font-semibold mb-2">ชื่อ-นามสกุล</h3>
                <p className="text-gray-900 font-bold text-lg">สมคิด คิดไม่ออก</p>
              </div>
              <div>
                <h3 className="text-gray-700 font-semibold mb-2">แผนก/ ตำแหน่ง</h3>
                <p className="text-gray-900 font-bold text-lg">Engineering | Frontend Developer</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* ประเภทการลา */}
              <div className="space-y-3">
                <label className="text-gray-700 font-semibold text-sm">ประเภทการลา</label>
                <select 
                  name="leaveTypeId"
                  defaultValue={editingLeave.leaveTypeId || editingLeave.leaveType?.id}
                  className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>เลือกประเภทการลา</option>
                  {leaveTypes.map((type, idx) => {
                    const thNames: Record<string, string> = {
                      "Annual Leave": "ลาพักร้อน",
                      "Sick Leave": "ลาป่วย",
                      "Personal Leave": "ลากิจ",
                      "Ordination Leave": "ลาบวช",
                      "Maternity Leave": "ลาคลอด"
                    };
                    const name = thNames[type.name] || type.name;
                    return <option key={idx} value={type.id || type.name}>{name}</option>
                  })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                {/* วันที่เริ่มต้น */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm">วันที่เริ่มต้น</label>
                  <div className="relative">
                    <input type="date" name="startDate" defaultValue={format(new Date(editingLeave.startDate), "yyyy-MM-dd")} className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
                {/* รูปแบบการลาเริ่มต้น */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 h-11">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="startLeaveFormat" value="full" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">เต็มวัน</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="startLeaveFormat" value="morning" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">ครึ่งวันเช้า</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="startLeaveFormat" value="afternoon" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">ครึ่งวันบ่าย</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* วันที่สิ้นสุด */}
                <div className="space-y-3">
                  <label className="text-gray-700 font-semibold text-sm">วันที่สิ้นสุด</label>
                  <div className="relative">
                    <input type="date" name="endDate" defaultValue={format(new Date(editingLeave.endDate), "yyyy-MM-dd")} className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
                {/* รูปแบบการลาสิ้นสุด */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 h-11">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="endLeaveFormat" value="full" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">เต็มวัน</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="endLeaveFormat" value="morning" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">ครึ่งวันเช้า</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="endLeaveFormat" value="afternoon" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm font-medium">ครึ่งวันบ่าย</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* เหตุผลการลา */}
            <div className="space-y-3 mb-8">
              <label className="text-gray-700 font-semibold text-sm">เหตุผลการลา</label>
              <textarea 
                name="reason"
                className="w-full border border-gray-300 rounded-lg p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
                placeholder="ระบุเหตุผลที่ชัดเจน..."
                defaultValue={editingLeave.reason}
              />
            </div>

            {/* เอกสารแนบ */}
            <div className="space-y-3 mb-10">
              <label className="text-gray-700 font-semibold text-sm">เอกสารแนบ (ถ้ามี)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                <div className="mb-3 text-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-600">คลิกเพื่ออัปโหลด</span></p>
                <p className="text-xs text-gray-400">รองรับ PDF, PNG ขนาดไม่เกิน 5MB</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setEditingLeave(null)} className="px-10 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white font-bold hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button type="button" onClick={() => setShowConfirmDialog(true)} className="px-10 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
                บันทึก
              </button>
            </div>
          </form>

          {/* Confirm Dialog Overlay */}
          {showConfirmDialog && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#34a853] rounded-full flex items-center justify-center text-white mb-8 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-4">ยืนยันการแก้ไขข้อมูล</h2>
                  <p className="text-gray-500 text-sm mt-2 leading-loose">
                    คำลาของคุณจะถูกส่งไปยังระบบ<br/>
                    สามารถเช็คสถานะได้จากหน้าเช็คสถานะของคุณ
                  </p>
                  <div className="flex gap-4 mt-10 w-full px-2">
                    <button onClick={() => setShowConfirmDialog(false)} className="flex-1 py-3 rounded-lg bg-[#ff0000] text-white font-bold text-base hover:bg-red-700 transition-colors">
                      ยกเลิก
                    </button>
                    <button onClick={() => formRef.current?.requestSubmit()} className="flex-1 py-3 rounded-lg bg-[#00b050] text-white font-bold text-base hover:bg-green-600 transition-colors">
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-col bg-[#cfcfcf] min-h-screen pb-12">
      <div className="flex-1 p-4 md:p-12 max-w-[1200px] mx-auto">
        
        {/* Top Header Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 px-6 md:px-8 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ประวัติการลา (Leave History)</h2>
            <p className="text-gray-500 text-sm mt-1">ดูประวัติและสถานะการลางานของคุณทั้งหมด</p>
          </div>
        </div>

        {/* Month & Year Picker */}
        <div className="mb-6 inline-flex items-center bg-white border border-gray-200 rounded-xl p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center px-4 text-gray-500 border-r border-gray-100 mr-1">
            <CalendarIcon className="w-4 h-4 mr-2.5 text-blue-500" />
            <span className="text-sm font-semibold tracking-wide">ช่วงเวลา</span>
          </div>
          
          <Select value={selectedMonth} onValueChange={(val) => val && setSelectedMonth(val)}>
            <SelectTrigger className="border-0 shadow-none focus:ring-0 focus-visible:ring-0 hover:bg-gray-50 rounded-lg px-4 h-10 bg-transparent font-medium text-gray-800 min-w-[130px] transition-all">
              <SelectValue placeholder="เลือกเดือน" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 p-1">
              {months.map(month => (
                <SelectItem key={month} value={month} className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <Select value={selectedYear} onValueChange={(val) => val && setSelectedYear(val)}>
            <SelectTrigger className="border-0 shadow-none focus:ring-0 focus-visible:ring-0 hover:bg-gray-50 rounded-lg px-4 h-10 bg-transparent font-medium text-gray-800 min-w-[100px] transition-all">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 p-1">
              {years.map(year => (
                <SelectItem key={year} value={year} className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left border-collapse">
              <thead className="bg-[#c8e6eb] text-gray-800 font-medium text-lg">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">วันที่ลา</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">ประเภทการลา</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">จำนวนวันลา</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">เหตุผล</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">สถานะ</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, i) => (
                  <tr key={leave.id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-center text-gray-800 font-medium">{formatLeaveDateRange(new Date(leave.startDate), new Date(leave.endDate))}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-gray-800 font-medium">
                      {{
                        "Annual Leave": "ลาพักร้อน",
                        "Sick Leave": "ลาป่วย",
                        "Personal Leave": "ลากิจ",
                        "Ordination Leave": "ลาบวช",
                        "Maternity Leave": "ลาคลอด"
                      }[leave.leaveType.name as string] || leave.leaveType.name}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-gray-800 font-medium">{leave.days} วัน</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-gray-800 font-medium max-w-[200px] truncate" title={leave.reason}>{leave.reason}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <Dialog>
                        <DialogTrigger className="text-gray-800 hover:text-gray-900 font-medium text-sm transition-colors cursor-pointer">
                          ดูรายละเอียด
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
                          <DialogHeader className="mb-2">
                            <DialogTitle className="text-xl font-bold">รายละเอียดคำขอลา (Leave Request Details)</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {/* Employee Info Box */}
                            <div className="border border-gray-300 rounded-xl p-4 flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-500 border border-fuchsia-100">
                                  <User className="w-5 h-5" />
                                </div>
                              </div>
                              <div className="space-y-2 w-full">
                                <h3 className="font-bold text-gray-900 text-base">ข้อมูลพนักงาน (Employee Info)</h3>
                                <div className="grid grid-cols-[130px_1fr] gap-y-2 text-sm text-gray-800">
                                  <span className="font-bold">ชื่อ:</span>
                                  <span>สมคิด คิดไม่ออก</span>
                                  
                                  <span className="font-bold">แผนก|ตำแหน่ง:</span>
                                  <span>Engineering | Frontend Developer</span>
                                </div>
                              </div>
                            </div>

                            {/* Leave Info Box */}
                            <div className="border border-gray-300 rounded-xl p-4 flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                  <CalendarIcon className="w-5 h-5" />
                                </div>
                              </div>
                              <div className="w-full">
                                <h3 className="font-bold text-gray-900 text-base mb-3">รายละเอียดการลา (Leave Information)</h3>
                                <div className="flex flex-col md:flex-row gap-4 border-t border-gray-200 pt-4">
                                  <div className="flex-[1.2] space-y-4 text-sm text-gray-800">
                                     <div className="flex">
                                       <span className="font-bold w-28">ประเภทการลา:</span>
                                       <span>{{
                                          "Annual Leave": "ลาพักร้อน",
                                          "Sick Leave": "ลาป่วย",
                                          "Personal Leave": "ลากิจ",
                                          "Ordination Leave": "ลาบวช",
                                          "Maternity Leave": "ลาคลอด"
                                        }[leave.leaveType.name as string] || leave.leaveType.name}</span>
                                     </div>
                                     <div className="flex">
                                       <span className="font-bold w-28">ช่วงเวลา:</span>
                                       <span>{formatLeaveDateRange(new Date(leave.startDate), new Date(leave.endDate))} ({leave.days} วัน)</span>
                                     </div>
                                  </div>
                                  <div className="flex-1 space-y-4">
                                     <div className="flex items-center gap-3 text-sm text-gray-800">
                                       <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100">
                                         <FileText className="w-4 h-4" />
                                       </div>
                                       <span className="font-bold w-28">รูปแบบการลา:</span>
                                       <span>เต็มวัน</span>
                                     </div>
                                     <div className="flex items-center gap-3 text-sm text-gray-800 border-t border-gray-200 pt-3">
                                       <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                                         <Paperclip className="w-4 h-4" />
                                       </div>
                                       <span className="font-bold w-28">เอกสารแนบ:</span>
                                       <span className="flex-1 text-center text-gray-400">-</span>
                                       <button className="p-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                                          <Download className="w-4 h-4" />
                                       </button>
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                              <h3 className="font-bold text-gray-900 text-sm">เหตุผลการลา</h3>
                              <div className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-600 bg-white min-h-[44px]">
                                {leave.reason}
                              </div>
                            </div>

                            {/* Approval */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-gray-400 text-[10px] tracking-widest border border-gray-200 px-1 rounded-sm shadow-sm bg-white">NID</span>
                                <h3 className="font-bold text-green-700 text-sm">การอนุมัติ (Approval)</h3>
                              </div>
                              <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center gap-4 text-sm w-full md:w-[220px]">
                                  <span className="font-bold text-gray-800 w-12">สถานะ:</span>
                                  <div className="flex-1">
                                    {getStatusBadge(leave.status)}
                                  </div>
                                </div>
                                <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
                                <div className="flex items-center gap-4 text-sm flex-1">
                                  <span className="font-bold text-gray-800 whitespace-nowrap">เหตุผลของผู้อนุมัติ</span>
                                  <div className="flex-1 bg-white border border-gray-300 rounded-lg p-2.5 text-gray-400 min-h-[40px] flex items-center">
                                    {leave.status === 'REJECTED' ? 'ขาดคนทำงาน' : '-----------------'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-2 flex justify-between items-center text-sm text-gray-400">
                              <div>
                                วันที่ยื่นคำขอ : {format(new Date(leave.createdAt), "d MMM", { locale: th })} {new Date(leave.createdAt).getFullYear() + 543} เวลา {format(new Date(leave.createdAt), "HH:mm น.")}
                              </div>
                              {leave.status === 'PENDING' && (
                                <div className="flex items-center gap-4">
                                  <button onClick={() => setEditingLeave(leave)} className="flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-700 transition-colors cursor-pointer">
                                    <Pencil className="w-4 h-4" />
                                    แก้ไขข้อมูล
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirmId(leave.id)} 
                                    className="flex items-center gap-1.5 text-red-600 font-bold hover:text-red-700 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    ลบข้อมูล
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
                {filteredLeaves.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium bg-white">
                      ไม่พบประวัติการลา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-[#ef4444] rounded-full flex items-center justify-center text-white mb-8 shadow-md">
                <Trash2 className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">ยืนยันการลบข้อมูล</h2>
              <p className="text-gray-500 text-sm mt-2 leading-loose">
                คุณแน่ใจหรือไม่ว่าต้องการลบคำขอลานี้?<br/>
                การดำเนินการนี้จะไม่สามารถย้อนกลับได้
              </p>
              <div className="flex gap-4 mt-10 w-full px-2">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-bold text-base hover:bg-gray-50 transition-colors cursor-pointer">
                  ยกเลิก
                </button>
                <button 
                  onClick={async () => {
                    const res = await deleteLeaveRequest(deleteConfirmId);
                    if (res?.success) {
                      setDeleteConfirmId(null);
                      router.refresh();
                    } else {
                      alert(res?.error || "เกิดข้อผิดพลาด");
                    }
                  }} 
                  className="flex-1 py-3 rounded-lg bg-[#ef4444] text-white font-bold text-base hover:bg-red-700 transition-colors cursor-pointer"
                >
                  ยืนยันการลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
