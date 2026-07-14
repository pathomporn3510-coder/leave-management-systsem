"use server"

import { revalidatePath } from "next/cache"

// Global in-memory state for mock data
let mockLeaves = [
  { id: 1, dateStr: "17-19 ก.ค. 2569", type: "ลาพักร้อน", days: "3 วัน", reason: "ไปพักผ่อน", status: "รออนุมัติ", statusColor: "bg-amber-500 hover:bg-amber-600" },
  { id: 2, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
  { id: 3, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
  { id: 4, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "1 วัน", reason: "ไปเที่ยวสยาม", status: "ปฏิเสธ", statusColor: "bg-red-500 hover:bg-red-600" },
  { id: 5, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
  { id: 6, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
  { id: 7, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "ปฏิเสธ", statusColor: "bg-red-500 hover:bg-red-600" },
  { id: 8, dateStr: "17-19 ก.ค. 2569", type: "ลากิจ", days: "3 วัน", reason: "ไปทำใบขับขี่", status: "อนุมัติ", statusColor: "bg-green-500 hover:bg-green-600" },
]

export async function getMockLeaves() {
  return mockLeaves
}

export async function updateMockLeave(id: number, data: { type: string, reason: string }) {
  mockLeaves = mockLeaves.map(leave => {
    if (leave.id === id) {
      return {
        ...leave,
        type: data.type,
        reason: data.reason
      }
    }
    return leave
  })
  
  revalidatePath("/dashboard/manager/leaves/my")
  return { success: true }
}
