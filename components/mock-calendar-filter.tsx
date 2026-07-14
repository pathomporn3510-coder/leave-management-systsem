"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
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
import { th, enUS } from "date-fns/locale"

export function MockCalendarFilter() {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  
  // The date shown on the button
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 6, 1)) // Default July 2026
  
  // The date determining which month's grid is shown in the popup
  const [viewDate, setViewDate] = useState(new Date(2026, 6, 1))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOpen = () => {
    setViewDate(selectedDate)
    setIsOpen(!isOpen)
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(subMonths(viewDate, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(addMonths(viewDate, 1))
  }

  const handleSelectDate = (day: Date) => {
    setSelectedDate(day)
    setIsOpen(false)
  }

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="relative inline-block" ref={popupRef}>
      <div 
        onClick={handleOpen}
        className="bg-white rounded-lg border-2 border-gray-300 px-4 py-1.5 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 z-0 transition-colors"
      >
        <span className="font-bold text-gray-700">{format(selectedDate, "MMMM yyyy", { locale: th })}</span>
        <CalendarIcon className="w-5 h-5 text-black" strokeWidth={2.5} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 w-[280px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
            </button>
            <span className="font-bold text-gray-800 text-sm">
              {format(viewDate, "MMMM yyyy", { locale: enUS })}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="text-xs font-bold text-gray-800 p-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
            {daysInMonth.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, viewDate)
              const isSelected = isSameDay(day, selectedDate)
              
              return (
                <div 
                  key={idx} 
                  onClick={() => handleSelectDate(day)}
                  className={`p-1 w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer transition-colors
                    ${!isCurrentMonth ? 'text-gray-300 hover:bg-gray-50' : ''}
                    ${isCurrentMonth && !isSelected ? 'text-gray-700 hover:bg-teal-50' : ''}
                    ${isSelected ? 'bg-[#0bbd9c] text-white shadow-sm font-bold' : ''}
                  `}
                >
                  {day.getDate()}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
