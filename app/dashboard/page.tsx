import { getDashboardData } from '@/lib/fetchers/dashboard';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ProjectOverview } from '@/components/dashboard/project-overview';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
  const { projects, recentLogs, todayTimeEntries, stats } =
    await getDashboardData();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Your construction empire at a glance
        </p>
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
