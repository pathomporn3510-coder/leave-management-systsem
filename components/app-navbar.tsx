"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, Menu, LayoutDashboard, FileText, Users, Settings, Building2, CalendarDays, Mail, Bell } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AppNavbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const getLinks = () => {
    const baseLinks = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]

    if (role === "USER") {
      baseLinks.push(
        { name: "สร้างคำขอลา", href: "/dashboard/user/leaves/new", icon: FileText },
        { name: "สถานะการลา", href: "/dashboard/user/leaves/status", icon: FileText },
        { name: "ประวัติการลา", href: "/dashboard/user/leaves/history", icon: CalendarDays },
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
        { name: "คำขอทั้งหมด", href: "/dashboard/hr/leaves", icon: CalendarDays },
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

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="flex flex-col">
          <div className="flex items-center gap-2 font-semibold pb-6 border-b">
            <Building2 className="h-6 w-6" />
            <span>LeaveMS</span>
          </div>
          <nav className="grid gap-2 text-lg font-medium py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === link.href ? "bg-muted text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Placeholder for Search or Breadcrumbs */}
      </div>
      <div className="flex items-center gap-2 md:gap-3 text-gray-500 mr-2 md:mr-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Mail className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>
                  {session?.user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {session?.user?.email}
            <div className="text-xs font-normal text-muted-foreground mt-1">
              Role: {session?.user?.role}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
