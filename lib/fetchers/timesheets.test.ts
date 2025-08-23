import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  timeEntry: { findMany: vi.fn() },
  project: { findMany: vi.fn() },
  user: { findMany: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getTimeEntries, getActiveProjects, getUsers } from '@/lib/fetchers/timesheets';

beforeEach(() => {
  mockPrisma.timeEntry.findMany.mockReset();
  mockPrisma.project.findMany.mockReset();
  mockPrisma.user.findMany.mockReset();
});

describe('timesheets fetcher', () => {
  it('getTimeEntries respects filters and returns entries', async () => {
    mockPrisma.timeEntry.findMany.mockResolvedValue([{ id: 'e1' }]);
    const res = await getTimeEntries({ project: 'p1', user: 'u1', search: 'work' });
    expect(mockPrisma.timeEntry.findMany).toHaveBeenCalled();
    expect(res).toHaveLength(1);
  });

  it('getActiveProjects and getUsers call prisma', async () => {
    mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1' }]);
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'u1' }]);

    const projects = await getActiveProjects();
    const users = await getUsers();

    expect(mockPrisma.project.findMany).toHaveBeenCalled();
    expect(mockPrisma.user.findMany).toHaveBeenCalled();
    expect(projects).toHaveLength(1);
    expect(users).toHaveLength(1);
  });
});
