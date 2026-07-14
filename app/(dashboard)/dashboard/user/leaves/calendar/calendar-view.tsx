"use client"

import { useState } from "react"
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval
} from "date-fns"
import { th } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarLeave {
  id: string
  title: string
  start: string
  end: string
  status: string
}

interface CalendarViewProps {
  leaves: CalendarLeave[]
}

export function CalendarView({ leaves }: CalendarViewProps) {
  // Using July 2026 to match the design mockups if we want, or just current date.
  // For the sake of the mockup showing exactly like the image, we start at July 2026 if it's currently that year, else just use new Date().
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))

  const monthsList = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ]
  const currentYearOptions = Array.from({ length: 21 }, (_, i) => (new Date().getFullYear() - 10 + i))

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const getEventsForDay = (day: Date) => {
    // Generate mock events relative to current month for demonstration
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()

    const mocks = [
      { date: new Date(y, m, 9), type: 'birthday', title: 'วันเกิดพนักงาน', color: 'bg-[#22c55e]', pillColor: 'bg-[#86efac]' },
      { date: new Date(y, m, 28), type: 'holiday', title: 'วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว', color: 'bg-[#ef4444]', pillColor: 'bg-[#fca5a5]' },
      { date: new Date(y, m, 29), type: 'holiday', title: 'วันอาสาฬหบูชา', color: 'bg-[#ef4444]', pillColor: 'bg-[#fca5a5]' },
      { date: new Date(y, m, 30), type: 'holiday', title: 'วันเข้าพรรษา', color: 'bg-[#ef4444]', pillColor: 'bg-[#fca5a5]' },
      { date: new Date(y, m, 31), type: 'event', title: 'กินเลี้ยงประจำเดือน', color: 'bg-[#f472b6]', pillColor: 'bg-[#fbcfe8]' },
    ]

    const events = mocks.filter(e => isSameDay(e.date, day))

    const thNames: Record<string, string> = {
      "Annual Leave": "ลาพักร้อน",
      "Sick Leave": "ลาป่วย",
      "Personal Leave": "ลากิจ",
      "Ordination Leave": "ลาบวช",
      "Maternity Leave": "ลาคลอด"
    };

    const approvedLeaves = leaves.filter(l => l.status === "CEO_APPROVED")
    const dayNorm = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()

    approvedLeaves.forEach(leave => {
      const startDate = new Date(leave.start)
      const endDate = new Date(leave.end)
      const startNorm = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
      const endNorm = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()

      if (dayNorm >= startNorm && dayNorm <= endNorm) {
        events.push({
          date: day,
          type: 'leave',
          title: thNames[leave.title] || leave.title,
          color: 'bg-[#22d3ee]',
          pillColor: 'bg-[#a5f3fc]'
        })
      }
    })

    return events
  }

  // Format month and year e.g. "กรกฎาคม 2026"
  const monthName = format(currentDate, "MMMM", { locale: th })
  const year = currentDate.getFullYear()
  const displayMonthYear = `${monthName} ${year}`

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 px-6 md:px-8 flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">ปฏิทินวันลา (Leava Calender)</h2>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="bg-[#e5e7eb] rounded-2xl shadow-md overflow-hidden">

        {/* Calendar Header Row */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#22d3ee]"></div>
              <span>วันลาของคุณ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
              <span>วันหยุดนักขัตฤกษ์</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#f472b6]"></div>
              <span>กิจกรรมบริษัท</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
              <span>วันเกิดพนักงาน</span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-400 rounded-md hover:bg-gray-200 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex bg-gray-50 border border-gray-400 rounded-md">
              <Select value={monthsList[currentDate.getMonth()]} onValueChange={(val) => {
                if (val) {
                  const mIdx = monthsList.indexOf(val)
                  setCurrentDate(new Date(currentDate.getFullYear(), mIdx, 1))
                }
              }}>
                <SelectTrigger className="h-8 border-0 shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent font-bold text-gray-800 min-w-[110px]">
                  <SelectValue>{monthsList[currentDate.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-64">
                  {monthsList.map((month, idx) => (
                    <SelectItem key={idx} value={month} className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-5 bg-gray-300 self-center"></div>

              <Select value={currentDate.getFullYear().toString()} onValueChange={(val) => {
                if (val) setCurrentDate(new Date(parseInt(val), currentDate.getMonth(), 1))
              }}>
                <SelectTrigger className="h-8 border-0 shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent font-bold text-gray-800 min-w-[80px]">
                  <SelectValue>{currentDate.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-64">
                  {currentYearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()} className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-400 rounded-md hover:bg-gray-200 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-[#e5e7eb] px-px pb-px">
          <div className="grid grid-cols-7 bg-[#9ca3af] text-white font-extrabold border-t border-b border-[#a1a1aa]">
            {weekDays.map((day, i) => (
              <div key={i} className={`text-center py-3 border-r border-[#a1a1aa] last:border-r-0 uppercase tracking-wider text-sm ${i === 0 || i === 6 ? 'bg-[#a1a1aa]' : 'bg-[#9ca3af]'}`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-[#a1a1aa] gap-px">
            {daysInMonth.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart)
              const events = getEventsForDay(day)

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] md:min-h-[140px] flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-[#e5e7eb]'}`}
                >
                  <div className="p-2 relative flex flex-wrap gap-1">
                    {/* The date number */}
                    {events.length > 0 ? (
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-extrabold text-lg text-black ${events[0].color}`}>
                        {format(day, "d")}
                      </div>
                    ) : (
                      <div className={`w-8 h-8 flex items-center font-extrabold text-lg pl-2 ${isCurrentMonth ? 'text-black' : 'text-gray-500'}`}>
                        {format(day, "d")}
                      </div>
                    )}
                  </div>

                  {/* Event pills at bottom */}
                  <div className="mt-auto p-1.5 flex flex-col gap-1">
                    {events.map((ev, i) => (
                      <div key={i} className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md text-black w-full break-words leading-tight ${ev.pillColor}`}>
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
