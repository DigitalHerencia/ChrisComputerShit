import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface TimeEntryFilters {
  search?: string;
  project?: string;
  user?: string;
}

export async function getTimeEntries(filters: TimeEntryFilters = {}) {
  const where: Prisma.TimeEntryWhereInput = {};

  if (filters.project && filters.project !== 'all') {
    where.projectId = filters.project;
  }

  if (filters.user && filters.user !== 'all-users') {
    where.userId = filters.user;
  }

  if (filters.search) {
    where.OR = [
      { description: { contains: filters.search, mode: 'insensitive' } },
      { project: { name: { contains: filters.search, mode: 'insensitive' } } },
      {
        user: {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  return prisma.timeEntry.findMany({
    where,
    include: {
      project: { select: { name: true, status: true } },
      user: { select: { firstName: true, lastName: true } },
    },
    orderBy: { date: 'desc' },
    take: 50,
  });
}

export async function getActiveProjects() {
  return prisma.project.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: 'asc' },
  });
}
