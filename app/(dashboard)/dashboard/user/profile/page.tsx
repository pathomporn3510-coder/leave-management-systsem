import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Mail, Building2, Briefcase, Hash } from "lucide-react"

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch complete employee details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      employee: {
        include: {
          department: true,
          position: true
        }
      }
    }
  })

  if (!user || !user.employee) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Profile not found</h2>
        <p>Your account is not linked to an employee profile.</p>
      </div>
    )
  }

  const { employee } = user

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">ข้อมูลส่วนตัว (Profile)</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>ข้อมูลพนักงานของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ชื่อ-นามสกุล</p>
                  <p className="text-base font-semibold">{employee.firstName} {employee.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">รหัสพนักงาน</p>
                  <p className="text-base font-semibold">{employee.employeeCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">อีเมล</p>
                  <p className="text-base font-semibold">{user.email}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
              <CardDescription>ข้อมูลการทำงาน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">แผนก (Department)</p>
                  <p className="text-base font-semibold">{employee.department?.name || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ตำแหน่ง (Position)</p>
                  <p className="text-base font-semibold">{employee.position?.name || "-"}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
