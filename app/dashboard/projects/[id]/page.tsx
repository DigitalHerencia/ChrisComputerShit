import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MapPin, Calendar, Users, CheckSquare, FileText, Clock, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      createdBy: { select: { firstName: true, lastName: true } },
      tasks: {
        include: {
          assignee: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      dailyLogs: {
        include: {
          createdBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { date: "desc" },
        take: 10,
      },
      timeEntries: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { date: "desc" },
        take: 10,
      },
      documents: {
        include: {
          uploadedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          tasks: true,
          dailyLogs: true,
          timeEntries: true,
          documents: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
    ON_HOLD: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PLANNING: "bg-purple-100 text-purple-800 border-purple-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">Project details and management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors] || ""}>
            {project.status.replace("_", " ")}
          </Badge>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>
            )}

            {project.client && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client.name}</p>
                </div>
              </div>
            )}

            {project.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{format(project.startDate, "MMM d, yyyy")}</p>
                </div>
              </div>
            )}

            {project.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{format(project.endDate, "MMM d, yyyy")}</p>
                </div>
              </div>
            )}
          </div>

          {project.description && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p>{project.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({project._count.tasks})</TabsTrigger>
          <TabsTrigger value="logs">Logs ({project._count.dailyLogs})</TabsTrigger>
          <TabsTrigger value="time">Time ({project._count.timeEntries})</TabsTrigger>
          <TabsTrigger value="docs">Docs ({project._count.documents})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{project._count.tasks}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">{project._count.dailyLogs}</p>
                    <p className="text-sm text-muted-foreground">Daily Logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{project._count.timeEntries}</p>
                    <p className="text-sm text-muted-foreground">Time Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{project._count.documents}</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Button asChild size="sm">
                <Link href={`/dashboard/tasks/new?project=${project.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks yet</p>
              ) : (
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {task.assignee && `Assigned to ${task.assignee.firstName} ${task.assignee.lastName}`}
                        </p>
                      </div>
                      <Badge variant="outline">{task.status.replace("_", " ")}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Daily Logs</CardTitle>
              <Button asChild size="sm">
                <Link href={`/dashboard/logs/new?project=${project.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Log
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {project.dailyLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No logs yet</p>
              ) : (
                <div className="space-y-4">
                  {project.dailyLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{format(log.date, "MMM d, yyyy")}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {log.createdBy.firstName} {log.createdBy.lastName}
                        </p>
                      </div>
                      <p className="text-sm">{log.workDone}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Time Entries</CardTitle>
              <Button asChild size="sm">
                <Link href={`/dashboard/timesheets/new?project=${project.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Time
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {project.timeEntries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No time entries yet</p>
              ) : (
                <div className="space-y-4">
                  {project.timeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{format(entry.date, "MMM d, yyyy")}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.user.firstName} {entry.user.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.hoursWorked} hours</p>
                        {entry.overtime > 0 && <p className="text-sm text-muted-foreground">+{entry.overtime} OT</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Button asChild size="sm">
                <Link href={`/dashboard/documents/new?project=${project.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {project.documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No documents yet</p>
              ) : (
                <div className="space-y-4">
                  {project.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.replace("_", " ")} • Uploaded by {doc.uploadedBy.firstName}{" "}
                          {doc.uploadedBy.lastName}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
