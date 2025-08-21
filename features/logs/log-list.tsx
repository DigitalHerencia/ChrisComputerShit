import Link from "next/link"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DailyLogCard } from "@/components/logs/daily-log-card"
import { LogFilters } from "@/features/logs/log-filters"
import {
  Plus,
  Calendar,
  FileText,
  Camera,
  ClipboardList,
} from "lucide-react"
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns"

interface LogListProps {
  searchParams: { q?: string; project?: string; range?: string }
}

export async function LogList({ searchParams }: LogListProps) {
  const { q, project, range } = searchParams
  const where: any = {}

  if (project && project !== "all") {
    where.projectId = project
  }

  if (q) {
    where.OR = [
      { workDone: { contains: q, mode: "insensitive" } },
      { notes: { contains: q, mode: "insensitive" } },
      { project: { name: { contains: q, mode: "insensitive" } } },
    ]
  }

  const today = new Date()
  if (range && range !== "all-time") {
    if (range === "today") {
      where.date = { gte: startOfDay(today), lte: endOfDay(today) }
    } else if (range === "this-week") {
      where.date = { gte: startOfWeek(today), lte: endOfWeek(today) }
    } else if (range === "this-month") {
      where.date = { gte: startOfMonth(today), lte: endOfMonth(today) }
    }
  }

  const [dailyLogs, projects] = await Promise.all([
    prisma.dailyLog.findMany({
      where,
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

  const thisWeek = dailyLogs.filter(
    (log) => log.date >= startOfWeek(today) && log.date <= endOfWeek(today)
  )
  const thisMonth = dailyLogs.filter(
    (log) => log.date >= startOfMonth(today) && log.date <= endOfMonth(today)
  )
  const totalPhotos = dailyLogs.reduce(
    (sum, log) => sum + log._count.photos,
    0
  )

  return (
    <>
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

      <Card>
        <CardContent className="pt-6">
          <LogFilters
            projects={projects}
            initialSearch={q}
            initialProject={project ?? "all"}
            initialRange={range ?? "all-time"}
          />
        </CardContent>
      </Card>

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
              <Camera className="h-5 w-5 text-accent" />
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
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{dailyLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </>
  )
}

