"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Upload, Check } from "lucide-react"

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
import { createLeaveRequest } from "../actions"

const formSchema = z.object({
  leaveTypeId: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  startLeaveFormat: z.string(),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  endLeaveFormat: z.string(),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
  reason: z.string().min(1, "กรุณาระบุเหตุผลการลา"),
  attachment: z.any().optional(),
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
      startLeaveFormat: "full",
      endLeaveFormat: "full",
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Show modal instead of submitting directly
    setFormData(values)
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    if (!formData) return;
    setLoading(true)
    setError("")
    
    try {
      const data = new FormData()
      data.append("leaveTypeId", formData.leaveTypeId)
      data.append("startDate", formData.startDate)
      data.append("startLeaveFormat", formData.startLeaveFormat)
      data.append("endDate", formData.endDate)
      data.append("endLeaveFormat", formData.endLeaveFormat)
      data.append("reason", formData.reason)
      
      const res = await createLeaveRequest(data)
      
      if (res?.error) {
        setError(res.error)
        setLoading(false)
        setShowConfirmModal(false)
      } else {
        setShowConfirmModal(false)
        router.push("/dashboard/user/leaves/status")
        router.refresh()
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      setLoading(false)
      setShowConfirmModal(false)
    }
  }

  return (
    <div className="space-y-8 relative">
      {/* User Info Box */}
      <div className="bg-[#f4f4f5] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-800 text-lg mb-2">ชื่อ-นามสกุล</p>
          <p className="font-semibold text-lg text-black">xxxxx xxxxxx</p>
        </div>
        <div>
          <p className="text-gray-800 text-lg mb-2">แผนก/ ตำแหน่ง</p>
          <p className="font-semibold text-lg text-black">Engineering | Frontend Developer</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && <div className="p-4 text-sm font-medium bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium text-base">ประเภทการลา</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="" disabled>เลือกประเภทการลา</option>
                      {leaveTypes.map((type, idx) => {
                         const thNames: Record<string, string> = {
                           "Annual Leave": "ลาพักร้อน",
                           "Sick Leave": "ลาป่วย",
                           "Personal Leave": "ลากิจ",
                           "Ordination Leave": "ลาบวช",
                           "Maternity Leave": "ลาคลอด"
                         };
                         const name = thNames[type.name] || type.name;
                         return <option key={idx} value={type.id || type.name}>{name}</option>
                      })}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium text-base">วันที่เริ่มต้น</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        type="date" 
                        {...field} 
                        className="rounded-md h-11 border-gray-300 bg-white focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startLeaveFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="full" checked={field.value === "full"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">เต็มวัน</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="morning" checked={field.value === "morning"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">ครึ่งวันเช้า</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="afternoon" checked={field.value === "afternoon"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">ครึ่งวันบ่าย</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium text-base">วันที่สิ้นสุด</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={loading} 
                        type="date" 
                        {...field} 
                        className="rounded-md h-11 border-gray-300 bg-white focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endLeaveFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="full" checked={field.value === "full"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">เต็มวัน</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="morning" checked={field.value === "morning"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">ครึ่งวันเช้า</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" {...field} value="afternoon" checked={field.value === "afternoon"} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="text-sm text-black">ครึ่งวันบ่าย</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>


          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-medium text-base">เหตุผลการลา</FormLabel>
                <FormControl>
                  <textarea 
                    disabled={loading}
                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="ระบุเหตุผลที่ชัดเจน..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-medium text-base">เอกสารแนบ (ถ้ามี)</FormLabel>
                <FormControl>
                  <div className="relative mt-2 border border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-white h-48">
                    <input 
                      type="file" 
                      accept=".pdf,.png"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                    {field.value && field.value.name ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-10 h-10 text-green-500 mb-3" />
                        <p className="text-base font-semibold text-gray-900">{field.value.name}</p>
                        <p className="text-sm text-gray-500 mt-2">คลิกเพื่อเปลี่ยนไฟล์</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-black mb-3 stroke-[2]" />
                        <p className="text-sm text-gray-800 mb-1">
                          ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-600 hover:underline">คลิกเพื่ออัปโหลด</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          รองรับ PDF,PNG ขนาดไม่เกิน 5MB
                        </p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="pt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-lg px-8 h-12 bg-blue-700 hover:bg-blue-800 text-white font-medium text-base shadow-sm"
            >
              ส่งคำขอลา
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] mx-4 p-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-[#3da44c] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Check className="w-14 h-14 text-white stroke-[4]" />
            </div>
            
            <h2 className="text-3xl font-bold text-black mb-6 text-center">ยืนยันการส่งแบบฟอร์มยื่นคำขอลา</h2>
            
            <p className="text-gray-500 text-center text-base leading-relaxed mb-10">
              คำลาของคุณจะถูกส่งไปยังระบบ<br/>
              สามารถเช็คสถานะได้จากหน้าเช็คสถานะของคุณ
            </p>
            
            <div className="flex gap-6 w-full justify-center">
              <button 
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="bg-[#ff0000] hover:bg-red-600 text-white font-bold py-3 px-10 rounded-xl min-w-[140px] text-lg transition-colors shadow-sm"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={handleConfirmSubmit}
                className="bg-[#00b050] hover:bg-[#009644] text-white font-bold py-3 px-10 rounded-xl min-w-[140px] text-lg transition-colors shadow-sm"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
