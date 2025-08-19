import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar, Cloud, Users, FileText } from "lucide-react"
import { DailyLogCard } from "@/components/logs/daily-log-card"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export default async function DailyLogsPage() {
  const user = await currentUser()
  if (!user) return null

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) return null

  const [dailyLogs, projects] = await Promise.all([
    prisma.dailyLog.findMany({
      include: {
        project: { select: { name: true, status: true } },
        createdBy: { select: { firstName: true, lastName: true } },
        photos: true,
        _count: { select: { photos: true } },
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  // Calculate stats
  const today = new Date()
  const thisWeek = dailyLogs.filter((log) => log.date >= startOfWeek(today) && log.date <= endOfWeek(today))
  const thisMonth = dailyLogs.filter((log) => log.date >= startOfMonth(today) && log.date <= endOfMonth(today))
  const totalPhotos = dailyLogs.reduce((sum, log) => sum + log._count.photos, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Logs</h1>
          <p className="text-muted-foreground">Track daily progress and document work</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/logs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Log Entry
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10" />
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
            <Select defaultValue="all-time">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
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
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{thisWeek.length}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{thisMonth.length}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{totalPhotos}</p>
                <p className="text-sm text-muted-foreground">Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{dailyLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Logs */}
      {dailyLogs.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No daily logs yet</h3>
              <p className="text-muted-foreground mb-6">Start documenting your daily progress</p>
              <Button asChild>
                <Link href="/dashboard/logs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Log
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dailyLogs.map((log) => (
            <DailyLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
