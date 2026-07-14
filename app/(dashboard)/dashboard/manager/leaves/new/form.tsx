"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Upload, Check } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { updateMockLeave } from "@/actions/mock-leaves"

const formSchema = z.object({
  leaveTypeId: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  leaveFormat: z.string().optional(),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
  reason: z.string().min(5, "กรุณาระบุเหตุผลการลาอย่างน้อย 5 ตัวอักษร"),
  attachment: z.any().optional(),
})

interface LeaveFormProps {
  leaveTypes: any[]
}

export function LeaveForm({ leaveTypes }: LeaveFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "1"
  const defaultType = searchParams.get("type") || ""
  const defaultReason = searchParams.get("reason") || ""

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingData, setPendingData] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveTypeId: defaultType,
      leaveFormat: "full",
      startDate: isEdit ? "2026-07-17" : "",
      endDate: isEdit ? "2026-07-19" : "",
      reason: defaultReason,
    },
  })

  // Ensure form resets if query params change after initial mount
  useEffect(() => {
    if (isEdit) {
      form.reset({
        leaveTypeId: searchParams.get("type") || "",
        leaveFormat: "full",
        startDate: "2026-07-17",
        endDate: "2026-07-19",
        reason: searchParams.get("reason") || "",
      })
    }
  }, [searchParams, isEdit, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPendingData(values)
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setShowConfirm(false)
    setError("")
    
    if (isEdit) {
      const id = parseInt(searchParams.get("id") || "1", 10)
      const typeStr = pendingData.leaveTypeId
      
      await updateMockLeave(id, {
        type: typeStr,
        reason: pendingData.reason
      })
      
      router.push("/dashboard/manager/leaves/my")
      router.refresh()
    } else {
      setTimeout(() => {
        setLoading(false)
        router.push("/dashboard/manager/leaves/status")
        router.refresh()
      }, 1000)
    }
  }

  return (
    <div className="bg-transparent border-0 shadow-none">
      <div className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="p-4 text-sm font-medium bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
            
            {/* User Info Mock */}
            <div className="bg-[#f3f4f6] rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-gray-800 text-sm font-semibold mb-1">ชื่อ-นามสกุล</div>
                <div className="font-semibold text-base text-black">xxxxx xxxxxx</div>
              </div>
              <div className="md:text-right text-left w-full md:w-auto">
                <div className="text-gray-800 text-sm font-semibold mb-1 md:text-left text-left">แผนก/ ตำแหน่ง</div>
                <div className="font-semibold text-base text-black md:text-right text-left">Engineering | Frontend Developer</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">ประเภทการลา</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg h-10 bg-white border-gray-300 hover:bg-gray-50 focus:ring-[#0B0F4E]">
                          <SelectValue placeholder="เลือกประเภทการลา" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ลาพักร้อน" className="cursor-pointer">ลาพักร้อน (เหลือ 12 วัน)</SelectItem>
                        <SelectItem value="ลาป่วย" className="cursor-pointer">ลาป่วย (เหลือ 12 วัน)</SelectItem>
                        <SelectItem value="ลากิจ" className="cursor-pointer">ลากิจ (เหลือ 12 วัน)</SelectItem>
                        <SelectItem value="ลาคลอด" className="cursor-pointer">ลาคลอด (เหลือ 12 วัน)</SelectItem>
                        <SelectItem value="ลาบวช" className="cursor-pointer">ลาบวช (เหลือ 12 วัน)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm">รูปแบบการลา</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-6 h-10">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" {...field} value="full" checked={field.value === "full"} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-sm font-medium text-gray-700">เต็มวัน</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" {...field} value="morning" checked={field.value === "morning"} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-sm font-medium text-gray-700">ครึ่งวันเช้า</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" {...field} value="afternoon" checked={field.value === "afternoon"} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-sm font-medium text-gray-700">ครึ่งวันบ่าย</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

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
                        className="rounded-lg h-10 bg-white border-gray-300 hover:bg-gray-50 focus:ring-[#0B0F4E] text-gray-500 w-full uppercase"
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
                        className="rounded-lg h-10 bg-white border-gray-300 hover:bg-gray-50 focus:ring-[#0B0F4E] text-gray-500 w-full uppercase"
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
                      className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0B0F4E] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                      placeholder="ระบุเหตุผลที่ชัดเจน..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-gray-700 font-semibold text-sm block">เอกสารแนบ (ถ้ามี)</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center relative">
                <Upload className="h-8 w-8 text-black mb-3" strokeWidth={2.5} />
                <p className="text-sm text-gray-600 font-medium">ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-800">คลิกเพื่ออัปโหลด</span></p>
                <p className="text-xs text-gray-400 mt-1">รองรับ PDF,PNG ขนาดไม่เกิน 5MB</p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-lg px-8 h-10 bg-[#0014FF] hover:bg-blue-700 text-white font-semibold shadow-md"
              >
                {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอลา"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[450px] flex flex-col items-center justify-center p-8 border-0 shadow-2xl rounded-2xl bg-white">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md mt-4">
            <Check className="h-12 w-12 text-white" strokeWidth={4} />
          </div>
          <DialogHeader className="flex flex-col items-center w-full mb-2">
            <DialogTitle className="text-xl font-bold text-center text-black">
              {isEdit ? "ยืนยันการแก้ไขข้อมูล" : "ยืนยันการส่งแบบฟอร์มยื่นคำขอลา"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-sm text-gray-500 mb-8 leading-relaxed font-medium">
            คำลาของคุณจะถูกส่งไปยังระบบ<br/>สามารถเช็คสถานะได้จากหน้าเช็คสถานะของคุณ
          </div>
          <div className="flex gap-4 w-full justify-center mb-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowConfirm(false)} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-8 h-10 border-0 shadow-sm font-semibold hover:text-white"
            >
              ยกเลิก
            </Button>
            <Button 
              type="button"
              onClick={handleConfirm} 
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-8 h-10 border-0 shadow-sm font-semibold"
            >
              ยืนยัน
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
