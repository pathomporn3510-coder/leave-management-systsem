"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { submitLeave } from "@/actions/leaves"

const formSchema = z.object({
  leaveTypeId: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
  reason: z.string().min(10, "กรุณาระบุเหตุผลการลาอย่างน้อย 10 ตัวอักษร"),
})

interface LeaveFormProps {
  leaveTypes: any[]
}

export function LeaveForm({ leaveTypes }: LeaveFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError("")
    
    // Parse strings to dates for action
    const data = {
      leaveTypeId: values.leaveTypeId,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
      reason: values.reason,
    }

    const res = await submitLeave(data)
    
    if (res.success) {
      router.push("/dashboard/user/leaves/status")
      router.refresh()
    } else {
      setError(res.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    }
    setLoading(false)
  }

  return (
    <div className="bg-transparent border-0 shadow-none">
      <div className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="p-4 text-sm font-medium bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
            
            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-sm">ประเภทการลา</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:bg-gray-50 focus:ring-[#0B0F4E]">
                        <SelectValue placeholder="เลือกประเภทการลา" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((lt) => (
                        <SelectItem key={lt.id} value={lt.id} className="cursor-pointer">
                          {lt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">วันที่เริ่มต้น</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        type="date" 
                        {...field} 
                        className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:bg-gray-50 focus:ring-[#0B0F4E]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">วันที่สิ้นสุด</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        type="date" 
                        {...field} 
                        className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:bg-gray-50 focus:ring-[#0B0F4E]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-sm">เหตุผลการลา</FormLabel>
                  <FormControl>
                    <textarea 
                      disabled={loading}
                      className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0B0F4E] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                      placeholder="ระบุเหตุผลการลาของคุณ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="pt-4 flex items-center justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                disabled={loading}
                onClick={() => router.back()}
                className="rounded-xl px-8 h-12 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-xl px-8 h-12 bg-[#0B0F4E] hover:bg-[#151B63] text-white font-semibold shadow-lg shadow-blue-900/20"
              >
                {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอลา"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
