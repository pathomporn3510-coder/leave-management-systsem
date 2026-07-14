"use client"

import React, { useState } from "react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay
} from "date-fns"
import { th } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarView() {
  // Start with July 2026 to match the screenshot
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  const mockEvents = [
    { date: new Date(2026, 6, 9), title: "วันเกิดพนักงาน", type: "birthday" },
    { date: new Date(2026, 6, 13), title: "ลากิจ", type: "leave" },
    { date: new Date(2026, 6, 21), title: "ลากิจ", type: "leave" },
    { date: new Date(2026, 6, 22), title: "ลากิจ", type: "leave" },
    { date: new Date(2026, 6, 28), title: "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว", type: "holiday", pillClasses: "text-[8px] md:text-[9px]" },
    { date: new Date(2026, 6, 29), title: "วันอาสาฬหบูชา", type: "holiday" },
    { date: new Date(2026, 6, 30), title: "วันเข้าพรรษา", type: "holiday" },
    { date: new Date(2026, 6, 31), title: "กินเลี้ยงประจำเดือน", type: "activity" }
  ]

  const emptyCell = (key: React.Key) => (
    <div key={key} className="min-h-[100px] bg-gray-100 border-r border-b border-gray-300"></div>
  )

  const renderCell = (
    key: React.Key,
    date: number,
    circleColor?: string,
    pillColor?: string,
    pillText?: string,
    pillClasses?: string
  ) => {
    return (
      <div key={key} className="min-h-[100px] bg-white border-r border-b border-gray-300 p-2 flex flex-col items-start relative">
        <div className={`font-bold w-7 h-7 flex items-center justify-center rounded-full ${circleColor ? circleColor : 'text-black'}`}>
          {date}
        </div>
        {pillText && (
          <div className={`mt-auto w-full text-[9px] md:text-[10px] font-bold text-center py-1 px-1 rounded-sm leading-tight ${pillColor} ${pillClasses || ''}`}>
            {pillText}
          </div>
        )}
      </div>
    )
  }

  // Generate grid cells based on dates
  const cells = daysInMonth.map((day, idx) => {
    const isCurrentMonth = isSameMonth(day, monthStart)
    if (!isCurrentMonth) {
      return emptyCell(idx)
    }

    const event = mockEvents.find(e => isSameDay(e.date, day))
    
    let circleColor = ""
    let pillColor = ""
    
    if (event) {
      if (event.type === 'leave') {
        circleColor = "bg-[#1bc5bd] text-white"
        pillColor = "bg-[#a5f3fc] text-cyan-900"
      } else if (event.type === 'holiday') {
        circleColor = "bg-[#f64e60] text-white"
        pillColor = "bg-[#fecaca] text-red-900"
      } else if (event.type === 'birthday') {
        circleColor = "bg-[#10b981] text-white"
        pillColor = "bg-[#a7f3d0] text-green-900"
      } else if (event.type === 'activity') {
        circleColor = "bg-pink-400 text-white"
        pillColor = "bg-pink-200 text-pink-900"
      }
    }

    // Special case for day 10 being grey circle exactly like mock image
    if (isSameDay(day, new Date(2026, 6, 10))) {
      circleColor = "bg-gray-400 text-white"
    }

    return renderCell(idx, day.getDate(), circleColor, pillColor, event?.title, event?.pillClasses)
  })

  // Group cells into rows of 7
  const rows = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(
      <div key={`row-${i}`} className="grid grid-cols-7">
        {cells.slice(i, i + 7)}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Legend and Month Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1bc5bd]"></div>
            <span>วันลาของคุณ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#f64e60]"></div>
            <span>วันหยุดนักขัตฤกษ์</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-pink-400"></div>
            <span>กิจกรรมบริษัท</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#10b981]"></div>
            <span>วันเกิดพนักงาน</span>
          </div>
        </div>

        <div className="flex items-center border-2 border-gray-300 rounded-full px-3 py-1 gap-4 mt-4 md:mt-0 bg-gray-100">
          <button onClick={prevMonth} className="text-gray-600 hover:text-black font-bold p-1">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </button>
          <span className="font-bold text-sm md:text-base text-gray-800 w-32 text-center">
            {format(currentDate, "MMMM yyyy", { locale: th })}
          </span>
          <button onClick={nextMonth} className="text-gray-600 hover:text-black font-bold p-1">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border-l border-t border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-[#a0a0a0] text-white text-center font-bold text-xs md:text-sm">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="py-2 border-r border-b border-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows}
      </div>
    </div>
  )
}
