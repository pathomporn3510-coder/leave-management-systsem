import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

<<<<<<< HEAD
  if (session.user.role === "MANAGER") {
    redirect("/dashboard/manager")
=======
  // Redirect based on role
  if (session.user.role === "CEO") {
    redirect("/dashboard/ceo")
  }

  // Fetch some summary stats
  let whereClause = {}
  if (session.user.role === "USER") {
    whereClause = { employeeId: session.user.employeeId }
>>>>>>> 9602ab106b0d6f569d4f4d718587a6d4e911231d
  }

  // TODO: Add other role redirects if needed in the future
  // For now, if not a manager, they will just see a simple message 
  // or you can create their specific dashboards.
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <p>Role: {session.user.role}</p>
    </div>
  )
}
