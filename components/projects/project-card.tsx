import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, CheckSquare, FileText, Clock, Users } from "lucide-react"
import { format } from "date-fns"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string | null
    location?: string | null
    status: string
    startDate?: Date | null
    endDate?: Date | null
    client?: { name: string } | null
    createdBy: { firstName: string | null; lastName: string | null }
    _count: {
      tasks: number
      dailyLogs: number
      timeEntries: number
      documents: number
    }
  }
}

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  ON_HOLD: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PLANNING: "bg-purple-100 text-purple-800 border-purple-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const createdByName = `${project.createdBy.firstName || ""} ${project.createdBy.lastName || ""}`.trim()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
          <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors] || ""}>
            {project.status.replace("_", " ")}
          </Badge>
        </div>
        {project.description && <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Details */}
        <div className="space-y-2">
          {project.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{project.location}</span>
            </div>
          )}

          {project.client && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Client: {project.client.name}</span>
            </div>
          )}

          {project.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started: {format(project.startDate, "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{project._count.tasks}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-secondary" />
            <div>
              <p className="text-sm font-medium">{project._count.dailyLogs}</p>
              <p className="text-xs text-muted-foreground">Logs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <div>
              <p className="text-sm font-medium">{project._count.timeEntries}</p>
              <p className="text-xs text-muted-foreground">Time Entries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{project._count.documents}</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href={`/dashboard/projects/${project.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
