import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  dailyLog: { findMany: vi.fn(), findUnique: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getDailyLogs, getDailyLog } from '@/lib/fetchers/logs';

beforeEach(() => {
  mockPrisma.dailyLog.findMany.mockReset();
  mockPrisma.dailyLog.findUnique.mockReset();
});

describe('logs fetcher', () => {
  it('getDailyLogs returns results and calls prisma', async () => {
    mockPrisma.dailyLog.findMany.mockResolvedValue([{ id: 'l1' }]);
    const res = await getDailyLogs({ q: 'test', project: 'p1', range: 'today' });
    expect(mockPrisma.dailyLog.findMany).toHaveBeenCalled();
    expect(res).toHaveLength(1);
  });

  it('getDailyLog calls findUnique with id', async () => {
    mockPrisma.dailyLog.findUnique.mockResolvedValue({ id: 'l1' });
    const res = await getDailyLog('l1');
    expect(mockPrisma.dailyLog.findUnique).toHaveBeenCalledWith({ where: { id: 'l1' }, include: expect.any(Object) });
    expect(res).toEqual({ id: 'l1' });
  });
});
