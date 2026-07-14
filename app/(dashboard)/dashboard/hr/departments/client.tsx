"use client"

import { Plus } from "lucide-react"
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
import { DepartmentModal } from "./modal"
import { deleteDepartment } from "@/actions/departments"

interface DepartmentClientProps {
  data: any[]
}

export function DepartmentClient({ data }: DepartmentClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    setLoadingId(id)
    await deleteDepartment(id)
    setLoadingId(null)
  }

  return (
    <>
      <DepartmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Departments ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Manage your company departments.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <div className="mt-8 rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={loadingId === item.id}
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
