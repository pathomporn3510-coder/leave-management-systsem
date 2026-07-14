import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getLeaveRequests } from "@/actions/leaves"
import { ApprovalsClient } from "@/app/(dashboard)/dashboard/approvals/client"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ManagerLeavesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "MANAGER") {
    redirect("/dashboard")
  }

  // Get manager's department
  const manager = await prisma.employee.findUnique({
    where: { id: session.user.employeeId! }
  })

  if (!manager) {
    return <div>Manager profile not found</div>
  }

  const data = await getLeaveRequests("MANAGER", manager.departmentId)

  return <ApprovalsClient data={data} nextStatus="MANAGER_APPROVED" rejectStatus="REJECTED" />
}
