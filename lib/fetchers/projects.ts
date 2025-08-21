import { prisma } from '@/lib/db';

export async function getProjects() {
  return prisma.project.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
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
