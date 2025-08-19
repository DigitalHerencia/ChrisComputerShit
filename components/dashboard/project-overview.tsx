import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, Plus } from "lucide-react"

interface Project {
  id: string
  name: string
  status: string
  location?: string | null
  _count: {
    tasks: number
    dailyLogs: number
  }
}

interface ProjectOverviewProps {
  projects: Project[]
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Active Projects
        </CardTitle>
        <Button asChild size="sm">
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active projects yet</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                  {project.location && <p className="text-sm text-muted-foreground mb-2">{project.location}</p>}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{project._count.tasks} pending tasks</span>
                    <span>{project._count.dailyLogs} logs</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
