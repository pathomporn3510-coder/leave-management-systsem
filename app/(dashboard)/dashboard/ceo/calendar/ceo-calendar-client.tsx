'use client'

import { useState } from 'react'
import { Mail, Bell, Settings, ChevronLeft, ChevronRight, Users, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CEOCalendarClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  const openLeaveModal = (dateStr: string) => {
    setSelectedDate(dateStr)
    setIsModalOpen(true)
  }

  const days = [
    // row 1
    { date: null }, { date: null }, { date: null },
    { date: 1 },
    { date: 2, events: [{ type: 'leave', label: 'พนักงานลางาน 3 คน' }] },
    { date: 3 },
    { date: 4 },
    // row 2
    { date: 5, events: [{ type: 'leave', label: 'พนักงานลางาน 6 คน', trigger: '5 ก.ค. 2026' }] },
    { date: 6 },
    { date: 7 },
    { date: 8 },
    { date: 9, events: [{ type: 'birthday', label: 'วันเกิดพนักงาน' }] },
    { date: 10, isToday: true },
    { date: 11 },
    // row 3
    { date: 12 },
    { date: 13, events: [{ type: 'personal', label: 'ลากิจ' }] },
    { date: 14 },
    { date: 15, events: [{ type: 'leave', label: 'พนักงานลางาน 1 คน' }] },
    { date: 16 },
    { date: 17 },
    { date: 18 },
    // row 4
    { date: 19 },
    { date: 20 },
    { date: 21, events: [{ type: 'personal', label: 'ลากิจ' }] },
    { date: 22, events: [{ type: 'personal', label: 'ลากิจ' }] },
    { date: 23 },
    { date: 24 },
    { date: 25 },
    // row 5
    { date: 26 },
    { date: 27 },
    { date: 28, events: [{ type: 'holiday', label: 'วันเฉลิมพระ....' }] },
    { date: 29, events: [{ type: 'holiday', label: 'วันอาสาฬหบูชา' }] },
    { date: 30, events: [{ type: 'holiday', label: 'วันเข้าพรรษา' }] },
    { date: 31, events: [{ type: 'company', label: 'กินเลี้ยงประจำเดือน' }] },
    { date: null }
  ]

  const mockLeaveDetails = [
    { id: 1, name: 'สมจิตร จิตอาสา', dept: 'ฝ่ายบัญชี', type: 'ลาพักร้อน', avatarBg: 'bg-[#E5EEFF]', textColor: 'text-[#4A85F6]', initial: 'ส', badgeBg: 'bg-[#D6E4FF]', badgeText: 'text-[#2B6CB0]' },
    { id: 2, name: 'มานี มีนา', dept: 'ฝ่ายการตลาด', type: 'ลาป่วย', avatarBg: 'bg-[#EDE4FF]', textColor: 'text-[#805AD5]', initial: 'ม', badgeBg: 'bg-[#FEEBC8]', badgeText: 'text-[#C05621]' },
    { id: 3, name: 'สมคิด นึกไม่ออก', dept: 'ฝ่ายไอที', type: 'ลาป่วย', avatarBg: 'bg-[#E5EEFF]', textColor: 'text-[#4A85F6]', initial: 'ส', badgeBg: 'bg-[#FEEBC8]', badgeText: 'text-[#C05621]' },
    { id: 4, name: 'ชูใจ ใจดี', dept: 'ฝ่ายบัญชี', type: 'ลากิจ', avatarBg: 'bg-[#E5EEFF]', textColor: 'text-[#4A85F6]', initial: 'ช', badgeBg: 'bg-[#C6F6D5]', badgeText: 'text-[#276749]' },
    { id: 5, name: 'วิชัย อ่อนนุช', dept: 'ฝ่ายบุคคล', type: 'ลากิจ', avatarBg: 'bg-[#E5EEFF]', textColor: 'text-[#4A85F6]', initial: 'ว', badgeBg: 'bg-[#C6F6D5]', badgeText: 'text-[#276749]' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] p-6 md:p-10 font-sans">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Area */}
        <div className="bg-white rounded-t-[20px] px-8 py-5 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">ปฏิทินวันลา (Leave Calendar)</h1>
        </div>

        {/* Tools Area */}
        <div className="bg-[#EAEAEA] px-8 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm border-b border-gray-300">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#90E0EF]"></div>
              <span>วันลาของคุณ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFA1A1]"></div>
              <span>วันหยุดนักขัตฤกษ์</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F4A8D1]"></div>
              <span>กิจกรรมบริษัท</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#A7F3D0]"></div>
              <span>วันเกิดพนักงาน</span>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button className="bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="bg-white border border-gray-300 rounded-lg px-6 h-10 flex items-center justify-center shadow-sm font-bold text-gray-900 text-lg min-w-[160px]">
              กรกฎาคม 2026
            </div>
            <button className="bg-white border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white shadow-sm rounded-b-[20px] overflow-hidden border border-gray-200">
          <div className="grid grid-cols-7 border-b border-gray-300">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="py-3 text-center bg-[#A4A4A4] text-white font-extrabold text-lg uppercase border-r border-gray-300 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-white">
            {days.map((dayObj, i) => (
              <div 
                key={i} 
                className={`min-h-[140px] border-r border-b border-gray-200 last:border-r-0 p-3 flex flex-col gap-2 ${dayObj.date === null ? 'bg-[#E5E5E5]' : 'bg-white'}`}
              >
                {dayObj.date && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-extrabold ${dayObj.isToday ? 'bg-[#1e1e3f] text-white rounded-full w-9 h-9 flex items-center justify-center' : 'text-gray-900'}`}>
                      {dayObj.date}
                    </span>
                    {dayObj.isToday && <span className="text-[#F6A528] text-xs font-bold">TODAY</span>}
                  </div>
                )}
                
                {dayObj.events?.map((ev, idx) => {
                  if (ev.type === 'leave') {
                    return (
                      <button 
                        key={idx}
                        onClick={() => openLeaveModal(ev.trigger || `${dayObj.date} ก.ค. 2026`)}
                        className="bg-[#242146] hover:bg-[#343064] text-white text-[10px] sm:text-xs font-semibold py-2 px-2 rounded-[6px] shadow-sm text-left transition-colors truncate"
                      >
                        {ev.label}
                      </button>
                    )
                  }
                  
                  // Pills
                  let pillClass = ''
                  if (ev.type === 'personal') pillClass = 'bg-[#A2F0F7] text-[#000]'
                  if (ev.type === 'holiday') pillClass = 'bg-[#FFA1A1] text-[#000]'
                  if (ev.type === 'company') pillClass = 'bg-[#F4A8D1] text-[#000]'
                  if (ev.type === 'birthday') pillClass = 'bg-[#A7F3D0] text-[#000]'

                  return (
                    <div key={idx} className={`text-xs font-bold py-1.5 px-3 rounded-full text-center shadow-sm truncate ${pillClass}`}>
                      {ev.label}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leave Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-xl">
          {/* Header */}
          <div className="bg-[#1C1A3F] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-[#FFD700]" />
              <h2 className="text-2xl font-bold text-white">รายชื่อผู้ลางาน (วันที่ {selectedDate})</h2>
            </div>
            <DialogClose className="rounded-full bg-[#FF4B4B] w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors">
              <X className="w-5 h-5 text-white" />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="bg-white p-6 pb-8 max-h-[60vh] overflow-y-auto space-y-4">
            {mockLeaveDetails.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${user.avatarBg} flex items-center justify-center ${user.textColor} font-bold text-xl`}>
                    {user.initial}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                    <p className="text-gray-400 font-medium text-sm">{user.dept}</p>
                  </div>
                </div>
                <div className={`${user.badgeBg} ${user.badgeText} font-bold text-sm px-5 py-1.5 rounded-full`}>
                  {user.type}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
