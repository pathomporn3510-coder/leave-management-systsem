import { getLeaveTypes } from "@/actions/leave-types"
import { LeaveForm } from "./form"

export const dynamic = "force-dynamic"

export default async function NewLeavePage() {
  const leaveTypes = await getLeaveTypes()

  return (
    <div className="flex-col bg-[#E5E7EB] min-h-screen">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">แบบฟอร์มยื่นลา (Leave Request)</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">
              กรุณากรอกข้อมูลให้ครบถ้วนเพื่อส่งให้หัวหน้างานอนุมัติ
            </p>
          </div>
        </div>
        
        {/* Form Container */}
        <div className="max-w-5xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-10">
              <LeaveForm leaveTypes={leaveTypes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

