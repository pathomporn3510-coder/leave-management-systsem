import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role === "MANAGER") {
    redirect("/dashboard/manager")
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
