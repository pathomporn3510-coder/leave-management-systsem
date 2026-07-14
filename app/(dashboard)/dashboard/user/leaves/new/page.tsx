import { getLeaveTypes } from "@/actions/leave-types"
import { LeaveForm } from "./form"

export const dynamic = "force-dynamic"

export default async function NewLeavePage() {
  const leaveTypes = await getLeaveTypes()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Submit Leave Request</h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to request time off.
        </p>
        <div className="max-w-2xl mt-4">
          <LeaveForm leaveTypes={leaveTypes} />
        </div>
      </div>
    </div>
  )
}
