import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({ currentUser: vi.fn() }));
vi.mock('@/lib/db', () => ({
  prisma: {
    timeEntry: { create: vi.fn(), update: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createTimesheet, updateTimesheet, approveTimesheet } from './timesheets';

describe('timesheets actions', () => {
  beforeEach(() => vi.resetAllMocks());

  it('createTimesheet stores entry and returns id', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    const form = new Map([
      ['projectId', 'proj_cuid'],
      ['userId', 'user_cuid'],
      ['date', '2023-01-01'],
      ['hoursWorked', '8'],
      ['overtime', '0'],
      ['description', 'work'],
    ]);

    (prisma.timeEntry.create as any).mockResolvedValue({ id: 'entry1' });

    const res = await createTimesheet(undefined, form as unknown as FormData);

    expect(prisma.timeEntry.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/timesheets');
    expect(res).toEqual({ success: true, id: 'entry1' });
  });

  it('updateTimesheet updates and returns id', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    const form = new Map([
      ['id', 'entry1'],
      ['projectId', 'proj_cuid'],
      ['userId', 'user_cuid'],
      ['date', '2023-01-01'],
      ['hoursWorked', '8'],
    ]);

    (prisma.timeEntry.update as any).mockResolvedValue({ id: 'entry1' });

    const res = await updateTimesheet(undefined, form as unknown as FormData);

    expect(prisma.timeEntry.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/timesheets');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/timesheets/entry1');
    expect(res).toEqual({ success: true, id: 'entry1' });
  });

  it('approveTimesheet forbids if not supervisor/admin', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    const form = new Map([['id', 'entry1']]);
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'u1', role: 'USER' });

    const res = await approveTimesheet(undefined, form as unknown as FormData);
    expect(res).toEqual({ error: 'Insufficient permissions' });
  });

  it('approveTimesheet succeeds for admin', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    const form = new Map([['id', 'entry1']]);
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'u1', role: 'ADMIN' });

    (prisma.timeEntry.update as any).mockResolvedValue({});

    const res = await approveTimesheet(undefined, form as unknown as FormData);
    expect(prisma.timeEntry.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/timesheets');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/timesheets/entry1');
    expect(res).toEqual({ success: true });
  });
});
