import { prisma } from '@/lib/db';

export async function getProjects() {
  // Return the richer project shape expected by the UI (including counts and relations)
  return prisma.project.findMany({
    include: {
      client: true,
      createdBy: { select: { firstName: true, lastName: true } },
      _count: {
        select: {
          // keep the tasks count scoped to TODO like other UI queries
          tasks: { where: { status: 'TODO' } },
          dailyLogs: true,
          timeEntries: true,
          documents: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      status: true,
      startDate: true,
      endDate: true,
      clientId: true,
    },
  });
}
