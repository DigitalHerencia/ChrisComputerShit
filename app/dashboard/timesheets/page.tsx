import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { TimesheetCard } from "@/components/timesheets/timesheet-card"
import { PayrollSummary } from "@/components/timesheets/payroll-summary"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export default async function TimesheetsPage() {
  const user = await currentUser()
  if (!user) return null

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) return null

  const [timeEntries, projects, users] = await Promise.all([
    prisma.timeEntry.findMany({
      include: {
        project: { select: { name: true, status: true } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
  ])

  // Calculate stats
  const today = new Date()
  const thisWeek = timeEntries.filter((entry) => entry.date >= startOfWeek(today) && entry.date <= endOfWeek(today))
  const thisMonth = timeEntries.filter((entry) => entry.date >= startOfMonth(today) && entry.date <= endOfMonth(today))
  const pendingApproval = timeEntries.filter((entry) => !entry.approved)
  const totalHours = thisWeek.reduce((sum, entry) => sum + entry.hoursWorked + entry.overtime, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timesheets</h1>
          <p className="text-muted-foreground">Track hours and manage payroll</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/timesheets/payroll">
              <DollarSign className="h-4 w-4 mr-2" />
              Payroll Report
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/timesheets/new">
              <Plus className="h-4 w-4 mr-2" />
              Log Hours
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search timesheets..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all-users">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">All Employees</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Hours This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{thisMonth.length}</p>
                <p className="text-sm text-muted-foreground">Entries This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{pendingApproval.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{timeEntries.length}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Summary */}
      <PayrollSummary timeEntries={thisWeek} />

      {/* Time Entries */}
      {timeEntries.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No time entries yet</h3>
              <p className="text-muted-foreground mb-6">Start tracking hours for your projects</p>
              <Button asChild>
                <Link href="/dashboard/timesheets/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Log First Entry
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {timeEntries.map((entry) => (
            <TimesheetCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
