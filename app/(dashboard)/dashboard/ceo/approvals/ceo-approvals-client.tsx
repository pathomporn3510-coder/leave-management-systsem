'use client'

import { useState } from 'react'
import { Mail, Bell, Settings, Hourglass, List, CheckCircle, Calendar as CalendarIcon, Eye, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'

export function CEOApprovalsClient() {
  const [selectedMonth, setSelectedMonth] = useState('กรกฎาคม 2569')

  // Mock Table Data
  const [tableData, setTableData] = useState([
    { id: 1, name: 'นาย วิชัย สามารถ', dept: 'IT', type: 'ลาพักร้อน', date: '1-4 ส.ค.', status: 'รอดำเนินการ', actionStatus: null as 'อนุมัติแล้ว' | 'ปฏิเสธแล้ว' | null },
    { id: 2, name: 'นาย วิชัย สามารถ', dept: 'IT', type: 'ลาพักร้อน', date: '1-4 ส.ค.', status: 'รอดำเนินการ', actionStatus: null as 'อนุมัติแล้ว' | 'ปฏิเสธแล้ว' | null },
    { id: 3, name: 'นาย วิชัย สามารถ', dept: 'IT', type: 'ลาพักร้อน', date: '1-4 ส.ค.', status: 'รอดำเนินการ', actionStatus: null as 'อนุมัติแล้ว' | 'ปฏิเสธแล้ว' | null },
    { id: 4, name: 'นาย วิชัย สามารถ', dept: 'IT', type: 'ลาพักร้อน', date: '1-4 ส.ค.', status: 'รอดำเนินการ', actionStatus: null as 'อนุมัติแล้ว' | 'ปฏิเสธแล้ว' | null },
  ])

  // Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; rowId: number | null; actionType: 'approve' | 'reject' | null }>({
    isOpen: false,
    rowId: null,
    actionType: null,
  })

  // Details Dialog State
  const [detailsDialog, setDetailsDialog] = useState<{ isOpen: boolean; rowId: number | null }>({
    isOpen: false,
    rowId: null,
  })

  const openDialog = (id: number, type: 'approve' | 'reject') => {
    setConfirmDialog({ isOpen: true, rowId: id, actionType: type })
  }

  const openDetails = (id: number) => {
    setDetailsDialog({ isOpen: true, rowId: id })
  }

  const handleConfirm = () => {
    if (confirmDialog.rowId !== null && confirmDialog.actionType) {
      const newStatus = confirmDialog.actionType === 'approve' ? 'อนุมัติแล้ว' : 'ปฏิเสธแล้ว'
      setTableData((prev) => 
        prev.map((row) => row.id === confirmDialog.rowId ? { ...row, actionStatus: newStatus, status: newStatus } : row)
      )
    }
    setConfirmDialog({ isOpen: false, rowId: null, actionType: null })
  }

  const selectedRowDetails = detailsDialog.rowId ? tableData.find(r => r.id === detailsDialog.rowId) : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5] p-6 md:p-10 space-y-8 font-sans">
      
      {/* 1. Header Area */}
      <div className="bg-white rounded-[24px] px-8 py-5 flex flex-col md:flex-row items-center justify-between shadow-sm border border-blue-500/20">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">รายการคำขออนุมัติการลา</h1>
      </div>

      {/* 2. Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Pending */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Hourglass className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800">รอการตรวจสอบ</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-gray-900">{tableData.filter(r => !r.actionStatus).length}</span>
              <span className="text-gray-500 font-medium">รายการ</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Leave Types */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <List className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800">ประเภทการลา</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center justify-between bg-blue-50/80 px-3 py-2 rounded-xl border border-blue-100/50 flex-1 min-w-[100px]">
                <span className="text-xs font-bold text-blue-700">ลาพักร้อน</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">2</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100/50 flex-1 min-w-[100px]">
                <span className="text-xs font-bold text-emerald-700">ลากิจ</span>
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">2</span>
              </div>
              <div className="flex items-center justify-between bg-orange-50/80 px-3 py-2 rounded-xl border border-orange-100/50 flex-1 min-w-[100px]">
                <span className="text-xs font-bold text-orange-700">ลาป่วย</span>
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Last Approved */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800">อนุมัติล่าสุด</h3>
            </div>
            <div className="mt-4 text-gray-600 font-medium">
              <span className="text-xl font-bold text-gray-900">1</span> วันที่แล้ว
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 3. Main Table Section */}
      <Card className="rounded-[24px] border-none shadow-sm overflow-hidden flex flex-col bg-white">
        <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
          <h2 className="text-[22px] font-bold text-gray-900">คำขอลาที่ค้างอยู่</h2>
          <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 h-11 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">{selectedMonth}</span>
            <CalendarIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EBF3FF] text-[#4A5568] text-sm">
                <th className="py-4 px-6 font-bold whitespace-nowrap">พนักงาน</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">แผนก</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">ประเภทการลา</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">วันที่</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-center">สถานะ</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-5 px-6">
                    <span className="text-sm font-semibold text-gray-800">{row.name}</span>
                  </td>
                  <td className="py-5 px-6 text-sm text-gray-600">{row.dept}</td>
                  <td className="py-5 px-6 text-sm text-gray-600">{row.type}</td>
                  <td className="py-5 px-6 text-sm text-gray-600">{row.date}</td>
                  <td className="py-5 px-6 text-sm text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block min-w-[80px] text-center border ${
                      row.status === 'รอดำเนินการ' 
                        ? 'text-yellow-600 bg-yellow-100/50 border-yellow-200' 
                        : row.status === 'อนุมัติแล้ว'
                        ? 'text-green-600 bg-green-100/50 border-green-200'
                        : 'text-red-600 bg-red-100/50 border-red-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col items-center gap-2">
                      {!row.actionStatus ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => openDialog(row.id, 'approve')}
                              size="sm" 
                              className="bg-[#2B3467] hover:bg-[#1A2045] text-white rounded-lg h-8 px-4 text-xs font-bold shadow-sm"
                            >
                              อนุมัติ
                            </Button>
                            <Button 
                              onClick={() => openDialog(row.id, 'reject')}
                              size="sm" 
                              className="bg-[#E53E3E] hover:bg-[#C53030] text-white rounded-lg h-8 px-4 text-xs font-bold shadow-sm"
                            >
                              ปฏิเสธ
                            </Button>
                          </div>
                          <div 
                            onClick={() => openDetails(row.id)}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-[#2B3467] cursor-pointer mt-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">ดูรายละเอียด</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className={`px-4 py-1.5 rounded-md text-xs font-bold text-white shadow-sm mb-1 ${
                            row.actionStatus === 'อนุมัติแล้ว' ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                          }`}>
                            {row.actionStatus}
                          </span>
                          <div 
                            onClick={() => openDetails(row.id)}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-[#2B3467] cursor-pointer mt-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">ดูรายละเอียด</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, isOpen: false })}>
        <DialogContent className="sm:max-w-md p-10 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-[22px] font-bold text-gray-900 mb-8">
            ยืนยันการ{confirmDialog.actionType === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}การลา
          </h2>
          <div className="flex justify-center gap-4 w-full">
            <Button 
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
              variant="outline" 
              className="bg-[#ff0000] hover:bg-red-700 text-white hover:text-white border-none px-8 py-5 rounded-lg font-bold w-32 shadow-sm"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleConfirm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-5 rounded-lg font-bold w-32 shadow-sm"
            >
              ยืนยัน
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.isOpen} onOpenChange={(open) => !open && setDetailsDialog({ ...detailsDialog, isOpen: false })}>
        <DialogContent className="sm:max-w-lg p-8 rounded-2xl">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">รายละเอียดคำขอลา</h2>
          </div>
          
          {selectedRowDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                  <p className="font-semibold text-gray-900">{selectedRowDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">แผนก</p>
                  <p className="font-semibold text-gray-900">{selectedRowDetails.dept}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ประเภทการลา</p>
                  <p className="font-semibold text-gray-900">{selectedRowDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">วันที่ต้องการลา</p>
                  <p className="font-semibold text-gray-900">{selectedRowDetails.date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">เหตุผลการลา</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100">
                  ไปทำธุระส่วนตัวและพักผ่อนกับครอบครัวที่ต่างจังหวัด ไม่สามารถติดต่อได้ชั่วคราว
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">สถานะปัจจุบัน</p>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block border ${
                  selectedRowDetails.status === 'รอดำเนินการ' 
                    ? 'text-yellow-600 bg-yellow-100/50 border-yellow-200' 
                    : selectedRowDetails.status === 'อนุมัติแล้ว'
                    ? 'text-green-600 bg-green-100/50 border-green-200'
                    : 'text-red-600 bg-red-100/50 border-red-200'
                }`}>
                  {selectedRowDetails.status}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={() => setDetailsDialog({ ...detailsDialog, isOpen: false })}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 rounded-lg font-bold shadow-sm"
            >
              ปิดหน้าต่าง
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
