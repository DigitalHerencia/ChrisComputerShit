import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, DollarSign, Clock, Users } from "lucide-react"
import { PayrollTable } from "@/components/timesheets/payroll-table"
import { startOfMonth, subMonths } from "date-fns"

export default async function PayrollReportPage() {
  const user = await currentUser()
  if (!user) return null

  // Get time entries for payroll calculation
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      approved: true,
      date: {
        gte: startOfMonth(subMonths(new Date(), 1)), // Last 2 months
      },
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      project: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  })

  // Calculate payroll data
  const regularRate = 25 // $25/hour
  const overtimeRate = 37.5 // $37.50/hour (1.5x)

  const payrollData = timeEntries.reduce(
    (acc, entry) => {
      const userName = `${entry.user.firstName || ""} ${entry.user.lastName || ""}`.trim()
      if (!acc[userName]) {
        acc[userName] = {
          name: userName,
          regularHours: 0,
          overtimeHours: 0,
          totalHours: 0,
          regularPay: 0,
          overtimePay: 0,
          totalPay: 0,
          entries: 0,
        }
      }

      acc[userName].regularHours += entry.hoursWorked
      acc[userName].overtimeHours += entry.overtime
      acc[userName].totalHours += entry.hoursWorked + entry.overtime
      acc[userName].regularPay += entry.hoursWorked * regularRate
      acc[userName].overtimePay += entry.overtime * overtimeRate
      acc[userName].totalPay += entry.hoursWorked * regularRate + entry.overtime * overtimeRate
      acc[userName].entries += 1

      return acc
    },
    {} as Record<string, any>,
  )

  const payrollSummary = Object.values(payrollData)
  const totalRegularHours = payrollSummary.reduce((sum, emp: any) => sum + emp.regularHours, 0)
  const totalOvertimeHours = payrollSummary.reduce((sum, emp: any) => sum + emp.overtimeHours, 0)
  const totalPayroll = payrollSummary.reduce((sum, emp: any) => sum + emp.totalPay, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/timesheets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payroll Report</h1>
            <p className="text-muted-foreground">Employee hours and payroll calculations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="current-month">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-week">Current Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{payrollSummary.length}</p>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{(totalRegularHours + totalOvertimeHours).toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{totalOvertimeHours.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">${totalPayroll.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <PayrollTable data={payrollSummary} />
    </div>
  )
}
