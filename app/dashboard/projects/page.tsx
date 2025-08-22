import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  FolderOpen,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { ProjectCard } from '@/components/projects/project-card';

export default async function ProjectsPage() {
  const user = await currentUser();
  if (!user) return null;

  const projects = await prisma.project.findMany({
    include: {
      client: true,
      createdBy: { select: { firstName: true, lastName: true } },
      _count: {
        select: {
          tasks: { where: { status: 'TODO' } },
          dailyLogs: true,
          timeEntries: true,
          documents: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const activeProjects = projects.filter((p) => p.status === 'ACTIVE');
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
  const onHoldProjects = projects.filter((p) => p.status === 'ON_HOLD');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your construction projects
          </p>
        </div>
        </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <Button asChild className='w-full sm:w-auto'>
                <Link href="/dashboard/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                New Project
                </Link>
              </Button>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeProjects.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{completedProjects.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{onHoldProjects.length}</p>
                <p className="text-sm text-muted-foreground">On Hold</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first construction project
              </p>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
