import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getLeaveRequests } from "@/actions/leaves"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function MyLeavePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user.employeeId) {
    redirect("/dashboard")
  }

  // Fetch only this user's leaves
  const leaves = await getLeaveRequests("USER")

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Leave History</h2>
          <p className="text-sm text-muted-foreground">
            View the status of your leave requests.
          </p>
        </div>
        
        <div className="rounded-md border bg-card mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.leaveType.name}</TableCell>
                  <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.days}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.reason}>
                    {item.reason}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'CEO_APPROVED' ? 'default' : 
                        item.status === 'REJECTED' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {leaves.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    You haven't submitted any leave requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
