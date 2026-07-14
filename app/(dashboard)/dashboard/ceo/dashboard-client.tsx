"use client"



interface DashboardClientProps {
  data: any[]
}

export function DashboardClient({ data }: DashboardClientProps) {
  const statusMap: Record<string, { label: string, colorClass: string }> = {
    PENDING: { label: "รอหัวหน้างาน", colorClass: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    MANAGER_APPROVED: { label: "รอฝ่ายบุคคล", colorClass: "bg-blue-100 text-blue-700 border-blue-200" },
    HR_APPROVED: { label: "รอการอนุมัติ", colorClass: "bg-orange-100 text-orange-700 border-orange-200" },
    CEO_APPROVED: { label: "อนุมัติแล้ว", colorClass: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "ไม่อนุมัติ", colorClass: "bg-red-100 text-red-700 border-red-200" },
  }

  const departmentMap: Record<string, string> = {
    "Human Resources": "ฝ่ายบุคคล",
    "Engineering": "วิศวกรรม",
    "Executive": "ผู้บริหาร",
    "IT": "ไอที",
  }

  const leaveTypeMap: Record<string, string> = {
    "Annual Leave": "ลาพักร้อน",
    "Sick Leave": "ลาป่วย",
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-[#E1EAF4] border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">พนักงาน</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center whitespace-nowrap">แผนก</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center whitespace-nowrap">ประเภทการลา</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center whitespace-nowrap">วันที่</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center whitespace-nowrap">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const startDate = new Date(item.startDate)
              const endDate = new Date(item.endDate)
              let dateString = ""
              
              if (startDate.getMonth() === endDate.getMonth()) {
                if (startDate.getDate() === endDate.getDate()) {
                  dateString = `${startDate.getDate()} ${startDate.toLocaleString('th-TH', { month: 'short' })}`
                } else {
                  dateString = `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleString('th-TH', { month: 'short' })}`
                }
              } else {
                dateString = `${startDate.getDate()} ${startDate.toLocaleString('th-TH', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleString('th-TH', { month: 'short' })}`
              }

              const isSick = item.leaveType.name.toLowerCase().includes("sick")
              
              const deptName = item.employee.department?.name || "-"
              const thDeptName = departmentMap[deptName] || deptName
              
              const leaveName = item.leaveType.name
              const thLeaveName = leaveTypeMap[leaveName] || leaveName
              
              const statusInfo = statusMap[item.status] || { label: item.status, colorClass: "bg-gray-100 text-gray-700 border-gray-200" }

              return (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                        {item.employee.firstName.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{item.employee.firstName} {item.employee.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200/60 shadow-sm inline-block min-w-[80px]">
                      {thDeptName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm inline-block min-w-[80px] ${
                      isSick ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}>
                      {thLeaveName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-sm text-center whitespace-nowrap">
                    {dateString}
                    <span className="ml-2 text-xs text-gray-400 font-normal">({item.days} วัน)</span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm inline-block min-w-[90px] border ${statusInfo.colorClass}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">ไม่มีรายการรออนุมัติ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
