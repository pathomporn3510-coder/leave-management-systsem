"use client"

import { useState } from "react"
import { ViewDetailsButton } from "@/components/view-details-button"
import { ApprovalConfirmDialog } from "@/components/approval-confirm-dialog"

interface ManagerActionButtonsProps {
  item: any
}

export function ManagerActionButtons({ item }: ManagerActionButtonsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending")

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    if (actionType) {
      setStatus(actionType === "approve" ? "approved" : "rejected")
    }
  }

  if (status === "approved") {
    return (
      <div className="flex justify-end pr-1">
        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-md text-xs font-bold border border-green-200">อนุมัติแล้ว</span>
      </div>
    )
  }

  if (status === "rejected") {
    return (
      <div className="flex justify-end pr-1">
        <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-md text-xs font-bold border border-red-200">ปฏิเสธแล้ว</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <ViewDetailsButton 
          isPersonal={false} 
          leave={{
            name: item.name,
            type: item.type,
            dateStr: item.date,
            days: "หลายวัน", // mock
            reason: "รอการพิจารณา",
            status: "รออนุมัติ",
            statusColor: "bg-yellow-500"
          }}
        >
          <button className="bg-[#eab308] hover:bg-yellow-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors">
            รายละเอียด
          </button>
        </ViewDetailsButton>
        <button 
          onClick={() => handleAction("approve")}
          className="bg-[#10b981] hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors"
        >
          อนุมัติ
        </button>
        <button 
          onClick={() => handleAction("reject")}
          className="bg-[#ef4444] hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors"
        >
          ปฏิเสธ
        </button>
      </div>

      <ApprovalConfirmDialog 
        open={confirmOpen} 
        onOpenChange={setConfirmOpen} 
        actionType={actionType}
        onConfirm={handleConfirm}
      />
    </>
  )
}
