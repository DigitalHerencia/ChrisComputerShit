import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  project: { findMany: vi.fn(), findUnique: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getProjects, getProject } from '@/lib/fetchers/projects';

beforeEach(() => {
  mockPrisma.project.findMany.mockReset();
  mockPrisma.project.findUnique.mockReset();
});

describe('projects fetcher', () => {
  it('getProjects returns active projects', async () => {
    mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1', name: 'P' }]);
    const res = await getProjects();
    expect(mockPrisma.project.findMany).toHaveBeenCalled();
    expect(res).toHaveLength(1);
  });

  it('getProject returns a single project', async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ id: 'p1', name: 'P' });
    const res = await getProject('p1');
    expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 'p1' }, select: expect.any(Object) });
    expect(res).toEqual({ id: 'p1', name: 'P' });
  });
});
