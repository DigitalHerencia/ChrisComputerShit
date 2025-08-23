import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  project: { findMany: vi.fn() },
  dailyLog: { findMany: vi.fn() },
  timeEntry: { findMany: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getDashboardData } from '@/lib/fetchers/dashboard';

beforeEach(() => {
  mockPrisma.project.findMany.mockReset();
  mockPrisma.dailyLog.findMany.mockReset();
  mockPrisma.timeEntry.findMany.mockReset();
});

describe('dashboard fetcher', () => {
  it('returns aggregated dashboard data', async () => {
    mockPrisma.project.findMany.mockResolvedValue([
      { id: 'p1', _count: { tasks: 2 }, updatedAt: new Date() },
    ]);
    mockPrisma.dailyLog.findMany.mockResolvedValue([{ id: 'l1' }]);
    mockPrisma.timeEntry.findMany.mockResolvedValue([{ hoursWorked: 3 }]);

    const res = await getDashboardData();

    expect(res.stats.activeProjects).toBe(1);
    expect(res.stats.todayHours).toBe(3);
    expect(Array.isArray(res.projects)).toBeTruthy();
  });
});
