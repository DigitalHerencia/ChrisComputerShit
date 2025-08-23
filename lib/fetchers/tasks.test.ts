import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  task: { findMany: vi.fn(), findUnique: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getTasks, getTask } from '@/lib/fetchers/tasks';

beforeEach(() => {
  mockPrisma.task.findMany.mockReset();
  mockPrisma.task.findUnique.mockReset();
});

describe('tasks fetcher', () => {
  it('getTasks returns tasks and respects projectId', async () => {
    mockPrisma.task.findMany.mockResolvedValue([{ id: 't1' }]);
    const res = await getTasks('p1');
    expect(mockPrisma.task.findMany).toHaveBeenCalled();
    expect(res).toHaveLength(1);
  });

  it('getTask returns a single task', async () => {
    mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
    const res = await getTask('t1');
    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 't1' } });
    expect(res).toEqual({ id: 't1' });
  });
});
