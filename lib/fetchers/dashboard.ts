import { prisma } from '@/lib/db';

export async function getDashboardData() {
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

  const pendingTasks = projects.reduce(
    (sum, project) => sum + project._count.tasks,
    0
  );

  const stats = {
    activeProjects: projects.length,
    pendingTasks,
    todayHours: todayTimeEntries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    ),
    recentLogs: recentLogs.length,
  };

  return { projects, recentLogs, todayTimeEntries, stats };
}
