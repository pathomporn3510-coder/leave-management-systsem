import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CEOCalendarClient } from "./ceo-calendar-client"

export const dynamic = "force-dynamic"

export default async function CEOCalendarPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CEO") {
    // redirect("/dashboard") // Commented out for UI testing without DB
  }

  return <CEOCalendarClient />
}
