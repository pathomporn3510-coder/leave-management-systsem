"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { updateLeaveStatus } from "@/actions/leaves"

interface ApprovalsClientProps {
  data: any[]
  nextStatus: string
  rejectStatus: string
}

export function ApprovalsClient({ data, nextStatus, rejectStatus }: ApprovalsClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const onAction = async (id: string, status: string) => {
    setLoadingId(id)
    await updateLeaveStatus(id, status, `Changed to ${status}`)
    setLoadingId(null)
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Approvals ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Review and approve leave requests.
          </p>
        </div>
        
        <div className="rounded-md border bg-card mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.employee.firstName} {item.employee.lastName}
                  </TableCell>
                  <TableCell>{item.leaveType.name}</TableCell>
                  <TableCell>
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.days}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.reason}>
                    {item.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm"
                        disabled={loadingId === item.id}
                        onClick={() => onAction(item.id, nextStatus)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={loadingId === item.id}
                        onClick={() => onAction(item.id, rejectStatus)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No pending requests found.
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
