import { prisma } from '@/lib/db';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from 'date-fns';

interface LogFilters {
  q?: string;
  project?: string;
  range?: string;
}

export async function getDailyLogs(filters: LogFilters = {}) {
  const { q, project, range } = filters;
  const where: any = {};

  if (project && project !== 'all') {
    where.projectId = project;
  }

  if (q) {
    where.OR = [
      { workDone: { contains: q, mode: 'insensitive' } },
      { notes: { contains: q, mode: 'insensitive' } },
      { project: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }

  const today = new Date();
  if (range && range !== 'all-time') {
    if (range === 'today') {
      where.date = { gte: startOfDay(today), lte: endOfDay(today) };
    } else if (range === 'this-week') {
      where.date = { gte: startOfWeek(today), lte: endOfWeek(today) };
    } else if (range === 'this-month') {
      where.date = { gte: startOfMonth(today), lte: endOfMonth(today) };
    }
  }

  return prisma.dailyLog.findMany({
    where,
    include: {
      project: { select: { name: true, status: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      photos: true,
      _count: { select: { photos: true } },
    },
    orderBy: { date: 'desc' },
    take: 50,
  });
}

export async function getDailyLog(id: string) {
  return prisma.dailyLog.findUnique({
    where: { id },
    include: {
      project: { select: { name: true, location: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      photos: true,
    },
  });
}
