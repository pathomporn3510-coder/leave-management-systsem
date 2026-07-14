"use client"

import { Mail, Bell, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function TopActionIcons() {
  return (
    <div className="flex justify-end items-center mb-2 md:mr-4">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="p-2 hover:bg-gray-200 rounded-full transition-colors outline-none focus:ring-2 focus:ring-gray-300">
            <Mail className="h-7 w-7 text-black" strokeWidth={2.5} />
          </button>} />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>กล่องข้อความ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-8 text-center text-sm text-gray-500">ไม่มีข้อความใหม่</div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="p-2 hover:bg-gray-200 rounded-full transition-colors outline-none focus:ring-2 focus:ring-gray-300">
            <Bell className="h-7 w-7 text-black" strokeWidth={2.5} />
          </button>} />
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-8 text-center text-sm text-gray-500">ไม่มีการแจ้งเตือนใหม่</div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="h-8 w-[1.5px] bg-gray-400 mx-4"></div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<button className="p-2 hover:bg-gray-200 rounded-full transition-colors outline-none focus:ring-2 focus:ring-gray-300">
          <Settings className="h-7 w-7 text-black" strokeWidth={2.5} />
        </button>} />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>การตั้งค่าระบบ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/profile" />}>โปรไฟล์ของฉัน</DropdownMenuItem>
          <DropdownMenuItem>ตั้งค่าการแจ้งเตือน</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer" 
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            ออกจากระบบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
