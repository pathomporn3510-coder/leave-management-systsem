import { getDepartments } from "@/actions/departments"
import { DepartmentClient } from "./client"

export const dynamic = "force-dynamic"

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DepartmentClient data={departments} />
      </div>
    </div>
  )
}
