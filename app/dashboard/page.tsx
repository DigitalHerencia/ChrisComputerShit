import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProjectOverview } from '@/components/dashboard/project-overview'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {


  const startDate = new Date();
startDate.setHours(0, 0, 0, 0);

const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

  const [projects, recentLogs, todayTimeEntries] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: {
            tasks: { where: { status: 'TODO' } },
            dailyLogs: true,
          },
        },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.dailyLog.findMany({
      include: {
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timeEntry.findMany({
      where: {
         date: {
      gte: startDate,
      lt: endDate,
    },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        project: { select: { name: true } },
      },
    }),
  ]);

  const pendingTasks = projects.reduce((sum, project) => sum + project._count.tasks, 0);
  const stats = {
    activeProjects: projects.length,
    pendingTasks,
    todayHours: todayTimeEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0),
    recentLogs: recentLogs.length,
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your construction empire at a glance</p>
      </header>

      <DashboardStats stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectOverview projects={projects} />
          <RecentActivity logs={recentLogs} timeEntries={todayTimeEntries} />
        </div>

        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}