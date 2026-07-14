import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CEOInsightsClient } from "../ceo-insights-client"

export const dynamic = "force-dynamic"

export default async function CEOReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CEO") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-full">
      <CEOInsightsClient />
    </div>
  )
}
