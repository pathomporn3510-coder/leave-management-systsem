'use client'

import { useState } from 'react'
import { Mail, Bell, Settings, Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

export function CEOInsightsClient() {
  const [selectedMonth, setSelectedMonth] = useState('กรกฎาคม 2569')

  // Mock Area Chart Data
  const trendData = [
    { name: 'ส.ค.', current: 4, previous: 2 },
    { name: 'ก.ย.', current: 3, previous: 1 },
    { name: 'ต.ค.', current: 6, previous: 3 },
    { name: 'พ.ย.', current: 12, previous: 5 },
    { name: 'ธ.ค.', current: 18, previous: 8 },
    { name: 'ม.ค.', current: 9, previous: 4 },
    { name: 'ก.พ.', current: 15, previous: 6 },
  ]

  // Mock Table Data
  const tableData = [
    { id: 'EMP-012', name: 'สมคิด ดีมั้ย', dept: 'Developer', reason: 'ลากิจ', date: '17 - 19 ก.ค.', days: '3วัน', status: 'อนุมัติ', statusColor: 'bg-green-500' },
    { id: 'EMP-013', name: 'มานี สีใส', dept: 'Marketing', reason: 'ลาป่วย', date: '20 ก.ค.', days: '1วัน', status: 'ปฏิเสธ', statusColor: 'bg-red-500' },
    { id: 'EMP-014', name: 'ปิติ ใจดี', dept: 'HR', reason: 'ลาพักร้อน', date: '21 - 25 ก.ค.', days: '5วัน', status: 'รออนุมัติ', statusColor: 'bg-yellow-500' },
    { id: 'EMP-015', name: 'สมศรี น่ารัก', dept: 'Sales', reason: 'ลากิจ', date: '26 ก.ค.', days: '1วัน', status: 'อนุมัติ', statusColor: 'bg-green-500' },
    { id: 'EMP-016', name: 'ชูใจ ใจสู้', dept: 'Developer', reason: 'ลาป่วย', date: '28 - 29 ก.ค.', days: '2วัน', status: 'อนุมัติ', statusColor: 'bg-green-500' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5] p-6 md:p-10 space-y-8 font-sans">
      
      {/* 1. Header Area */}
      <div className="bg-white rounded-[24px] px-8 py-5 flex flex-col md:flex-row items-center justify-between shadow-sm border border-blue-500/20">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">รายงานการลา <span className="text-gray-500 font-medium ml-2">(CEO Insights)</span></h1>
      </div>

      {/* 2. Top Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card 1: Working Status Donut Chart */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[18px] font-bold text-gray-800">สถานะการปฏิบัติงานวันนี้</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6 pt-0">
            <div className="flex items-center gap-8 mt-4">
              {/* CSS SVG Donut */}
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="16" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00C851" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="25.12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff4444" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="226.08" className="transform origin-center" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">90%</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#00C851]"></div>
                  <span className="text-gray-700 font-medium text-sm">มาทำงาน</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#ff4444]"></div>
                  <span className="text-gray-700 font-medium text-sm">ลางาน</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Common Leave Types */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[18px] font-bold text-gray-800">ประเภทการลาที่พบบ่อย (เดือนนี้)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-6">
            <div className="space-y-6">
              {/* Sick Leave */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-sm font-bold text-gray-700">ลาป่วย</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden flex items-center">
                  <div className="h-full bg-orange-400 rounded-full w-[40%] shadow-sm"></div>
                </div>
                <span className="w-10 text-right text-sm font-bold text-gray-600">40%</span>
              </div>
              {/* Personal Leave */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-sm font-bold text-gray-700">ลากิจ</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden flex items-center">
                  <div className="h-full bg-[#00C851] rounded-full w-[50%] shadow-sm"></div>
                </div>
                <span className="w-10 text-right text-sm font-bold text-gray-600">50%</span>
              </div>
              {/* Vacation Leave */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-sm font-bold text-gray-700">ลาพักร้อน</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden flex items-center">
                  <div className="h-full bg-blue-600 rounded-full w-[10%] shadow-sm"></div>
                </div>
                <span className="w-10 text-right text-sm font-bold text-gray-600">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Leave Trend Area Chart */}
        <Card className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-0">
            <CardTitle className="text-[18px] font-bold text-gray-800">แนวโน้มการลาของเดือนนี้</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip />
                <Area type="monotone" dataKey="previous" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPrev)" strokeWidth={2} />
                <Area type="monotone" dataKey="current" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* 3. Bottom Table Section */}
      <Card className="rounded-[24px] border-none shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">รายชื่อการลาของพนักงาน (ทั้งหมด)</h2>
          <div className="flex items-center gap-3">
            <Button className="bg-[#4F23C0] hover:bg-[#3D1A96] text-white rounded-lg px-6 h-10 shadow-sm">
              Export (CSV)
            </Button>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 h-10 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">{selectedMonth}</span>
              <CalendarIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D3EBF5] text-gray-800 text-sm">
                <th className="py-4 px-6 font-bold whitespace-nowrap">รหัสพนักงาน</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">ชื่อ-นามสกุล</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">แผนก</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">เหตุผลการลา</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">วันที่การลา</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-center">จำนวนวัน</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-600">{row.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{row.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{row.dept}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{row.reason}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{row.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-center">{row.days}</td>
                  <td className="py-4 px-6 text-sm text-center">
                    <span className={`${row.statusColor} text-white px-4 py-1.5 rounded-full text-xs font-bold inline-block min-w-[80px]`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  )
}
