"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  PieChart,
  SquarePen,
  Activity,
  BookText,
  CalendarDays,
  LogOut,
  Users,
  Settings,
  Building2,
  FileText
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const getLinks = () => {
    const baseLinks = [
      { name: "Dashboard", href: "/dashboard", icon: PieChart },
    ]

    if (role === "USER") {
      baseLinks.push(
        { name: "สร้างคำขอลา", href: "/dashboard/user/leaves/new", icon: SquarePen },
        { name: "สถานะการลา", href: "/dashboard/user/leaves/status", icon: Activity },
        { name: "ประวัติการลา", href: "/dashboard/user/leaves/my", icon: BookText },
        { name: "ปฏิทินวันลา", href: "/dashboard/user/leaves/calendar", icon: CalendarDays },
        { name: "ข้อมูลส่วนตัว", href: "/dashboard/user/profile", icon: Users }
      )
    }

    if (role === "MANAGER") {
      baseLinks.push(
        { name: "คำขอของทีม", href: "/dashboard/manager/leaves", icon: Users },
      )
    }

    if (role === "HR") {
      baseLinks.push(
        { name: "คำขอทั้งหมด", href: "/dashboard/hr/leaves", icon: Activity },
        { name: "พนักงาน", href: "/dashboard/hr/employees", icon: Users },
        { name: "แผนก", href: "/dashboard/hr/departments", icon: Building2 },
        { name: "ตั้งค่า", href: "/dashboard/hr/settings", icon: Settings }
      )
    }

    if (role === "CEO") {
      baseLinks.push(
        { name: "รายงาน", href: "/dashboard/ceo/reports", icon: FileText },
        { name: "อนุมัติ", href: "/dashboard/ceo/approvals", icon: Users },
      )
    }

    return baseLinks
  }

  const links = getLinks()

  // Extract name for placeholder
  const userName = session?.user?.email?.split('@')[0] || "xxxxx xxxx"

  return (
    <div className="hidden md:flex h-full w-[280px] flex-col bg-[#0B0F4E] text-white">
      {/* Logo Area */}
      <div className="flex flex-col items-center justify-center pt-8 pb-6">
        <div className="flex items-center text-4xl font-light tracking-widest text-white">
          <span>N</span>
          <div className="flex flex-col items-center -mt-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 mb-1"></span>
            <span className="-mt-1">I</span>
          </div>
          <span>D</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-gray-400 mt-1 uppercase">Progress Technology</span>
      </div>

      <div className="px-5 mb-8">
        <div className="flex items-center gap-4 rounded-xl bg-[#1F2445] p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 overflow-hidden shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate text-white">ชื่อ {userName}</span>
            <span className="text-xs text-[#8890B5] truncate">ตำแหน่ง {role || "xxxxxxxx"}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 scrollbar-hide">
        <nav className="flex flex-col gap-4 text-base font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center group"
              >
                {/* Active Indicator Accent */}
                {isActive && (
                  <div className="absolute left-[-20px] top-0 bottom-0 w-8 bg-[#7A89F9] rounded-r-3xl z-0 pointer-events-none" />
                )}
                
                <div className={cn(
                  "relative z-10 flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-all",
                  isActive 
                    ? "bg-[#181C43] text-[#7A89F9]" 
                    : "text-[#8890B5] hover:text-[#7A89F9] hover:bg-[#181C43]/50"
                )}>
                  <link.icon className={cn("h-6 w-6", isActive ? "text-[#7A89F9]" : "text-[#8890B5] group-hover:text-[#7A89F9]")} />
                  <span>{link.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-5 mt-auto border-t border-[#1F2445]">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#371D3A] px-4 py-3.5 text-[#E66E6E] transition-all hover:bg-[#4a264e] font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  )
}
