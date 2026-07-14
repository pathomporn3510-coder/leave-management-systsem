import { getLeaveTypes } from "@/actions/leave-types"
import { LeaveForm } from "./form"

export const dynamic = "force-dynamic"

export default async function NewLeavePage() {
  const leaveTypes = await getLeaveTypes()

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="rounded-2xl bg-[#0B0F4E] p-8 text-white">
          <h2 className="text-3xl font-bold tracking-tight">สร้างคำขอลา</h2>
          <p className="text-[#8890B5] mt-2 text-lg">
            กรุณากรอกรายละเอียดเพื่อยื่นคำขอลาพักผ่อนหรือลากิจ
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <LeaveForm leaveTypes={leaveTypes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

