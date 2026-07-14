import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getLeaveRequests } from "@/actions/leaves"
import { ApprovalsClient } from "@/app/(dashboard)/dashboard/approvals/client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function HRLeavesPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "HR" && session.user.role !== "CEO")) {
    redirect("/dashboard")
  }

  const data = await getLeaveRequests("HR")

  return <ApprovalsClient data={data} nextStatus="HR_APPROVED" rejectStatus="REJECTED" />
}
