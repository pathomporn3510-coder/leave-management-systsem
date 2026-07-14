import { getLeaveTypes } from "@/actions/leave-types"
import { LeaveForm } from "./form"

export const dynamic = "force-dynamic"

export default async function NewLeavePage() {
  const leaveTypes = await getLeaveTypes()

  return (
    <div className="flex flex-col bg-[#E5E7EB] -m-4 md:-m-6 lg:-m-8 min-h-screen">
      {/* Top Header matching mockup */}
      <div className="bg-white px-8 py-4 flex items-center justify-between shadow-sm m-4 md:m-8 mb-2 rounded-xl border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-black">แบบฟอร์มยื่นลา (Leave Request)</h1>
          <p className="text-sm text-gray-600 mt-1">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อส่งให้หัวหน้างานอนุมัติ</p>
        </div>
      </div>
      
      <div className="px-4 md:px-8 pb-8 mt-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <LeaveForm leaveTypes={leaveTypes} />
        </div>
      </div>
    </div>
  )
}
