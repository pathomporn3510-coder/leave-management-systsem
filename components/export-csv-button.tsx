"use client"

import React from "react"

interface ExportCsvButtonProps {
  data: any[]
  filename?: string
}

export function ExportCsvButton({ data, filename = "leave_history.csv" }: ExportCsvButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return

    // Define CSV headers
    const headers = ["ชื่อ-นามสกุล", "วันที่ลา", "ประเภทการลา", "จำนวนวัน", "เหตุผล", "สถานะ"]

    // Map data to rows
    const rows = data.map(item => [
      `"${item.name || ''}"`,
      `"${item.date || ''}"`,
      `"${item.type || ''}"`,
      `"${item.days || ''}"`,
      `"${item.reason || ''}"`,
      `"${item.status || ''}"`
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    // Add BOM for Excel UTF-8 compatibility
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" })
    
    // Create download link
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={handleExport}
      className="bg-[#C4B5FD] hover:bg-[#A78BFA] text-white px-6 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors"
    >
      Export (CSV)
    </button>
  )
}
