import { prisma } from '../db';

export async function getTasks(projectId?: string) {
  return prisma.task.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTask(id: string) {
  return prisma.task.findUnique({ where: { id } });
}
