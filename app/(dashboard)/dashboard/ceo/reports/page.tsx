"use client"

import { Button } from "@/components/ui/button"
import { Overview } from "@/components/dashboard/overview"
import { Download, FileText } from "lucide-react"
import { utils, writeFile } from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Mock data for export
const mockData = [
  { id: "1", employee: "John Doe", type: "Annual", days: 3, status: "CEO_APPROVED" },
  { id: "2", employee: "Jane Smith", type: "Sick", days: 1, status: "HR_APPROVED" },
  { id: "3", employee: "Bob Ross", type: "Unpaid", days: 5, status: "REJECTED" },
]

export default function ReportsPage() {
  
  const exportExcel = () => {
    const ws = utils.json_to_sheet(mockData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Leaves")
    writeFile(wb, "Leave_Report.xlsx")
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text("Leave Management Report", 14, 15)
    
    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Employee', 'Type', 'Days', 'Status']],
      body: mockData.map(item => [item.id, item.employee, item.type, item.days, item.status]),
    })
    
    doc.save("Leave_Report.pdf")
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={exportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 pb-2">
              <h3 className="font-semibold leading-none tracking-tight">Overview</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly leave statistics
              </p>
            </div>
            <div className="p-6">
              <Overview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
