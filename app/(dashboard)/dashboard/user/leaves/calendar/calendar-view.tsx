"use client"

import { useState } from "react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isWithinInterval
} from "date-fns"
import { th } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [currentDate, setCurrentDate] = useState(new Date())

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "MMMM yyyy"
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]

  const getLeaveForDay = (day: Date) => {
    return leaves.find(leave => {
      const start = new Date(leave.start)
      const end = new Date(leave.end)
      // Normalize dates to remove time parts for comparison
      const normDay = new Date(day.getFullYear(), day.getMonth(), day.getDate())
      const normStart = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const normEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate())
      
      return isWithinInterval(normDay, { start: normStart, end: normEnd })
    })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#0B0F4E]">
          {format(currentDate, dateFormat, { locale: th })}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-xl border-gray-200">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="rounded-xl border-gray-200 px-4 font-semibold text-gray-600">
            วันนี้
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-xl border-gray-200">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-2 gap-2">
        {weekDays.map((day, idx) => (
          <div key={idx} className="text-center font-bold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isToday = isSameDay(day, new Date())
          const leaveOnDay = getLeaveForDay(day)
          
          let dayClasses = "min-h-[100px] p-2 rounded-xl border transition-all relative flex flex-col "
          
          if (!isCurrentMonth) {
            dayClasses += "bg-gray-50/50 border-transparent text-gray-400"
          } else {
            dayClasses += "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
          }

          if (isToday) {
            dayClasses += " ring-2 ring-[#0B0F4E] ring-offset-2"
          }

          let leaveIndicator = null
          if (leaveOnDay) {
            const isApproved = ["CEO_APPROVED", "APPROVED"].includes(leaveOnDay.status)
            leaveIndicator = (
              <div className={`mt-auto text-xs font-semibold px-2 py-1.5 rounded-lg truncate ${isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {leaveOnDay.title}
              </div>
            )
          }

          return (
            <div key={idx} className={dayClasses}>
              <span className={`text-sm font-bold block ${isCurrentMonth ? 'text-gray-700' : ''}`}>
                {format(day, "d")}
              </span>
              {leaveIndicator}
            </div>
          )
        })}
      </div>
    </div>
  )
}
