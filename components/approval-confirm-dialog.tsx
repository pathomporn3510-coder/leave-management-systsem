"use client"

import { Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ApprovalConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType: "approve" | "reject" | null
  onConfirm: () => void
}

export function ApprovalConfirmDialog({ open, onOpenChange, actionType, onConfirm }: ApprovalConfirmDialogProps) {
  if (!actionType) return null

  const isApprove = actionType === "approve"
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] flex flex-col items-center justify-center p-8 border-0 shadow-2xl rounded-2xl bg-white z-[100]">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md mt-4 ${isApprove ? 'bg-green-500' : 'bg-red-500'}`}>
          {isApprove ? (
            <Check className="h-12 w-12 text-white" strokeWidth={4} />
          ) : (
            <X className="h-12 w-12 text-white" strokeWidth={4} />
          )}
        </div>
        <DialogHeader className="flex flex-col items-center w-full mb-2">
          <DialogTitle className="text-xl font-bold text-center text-black">
            {isApprove ? "ยืนยันอนุมัติการลา" : "ยืนยันการปฏิเสธการลา"}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-sm text-gray-500 mb-8 leading-relaxed font-medium">
          {isApprove ? (
            <>คำอนุมัติคำลาของคุณจะถูกส่งไปยังระบบ<br/>สามารถเช็คสถานะได้จากหน้าอนุมัติการลา</>
          ) : (
            <>คำปฏิเสธการลาของคุณจะถูกส่งไปยังระบบ<br/>สามารถเช็คสถานะได้จากหน้าอนุมัติการลา</>
          )}
        </div>
        <div className="flex gap-4 w-full justify-center mb-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-8 h-10 border-0 shadow-sm font-semibold hover:text-white"
          >
            ยกเลิก
          </Button>
          <Button 
            type="button"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }} 
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-8 h-10 border-0 shadow-sm font-semibold hover:bg-green-600"
          >
            ยืนยัน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
