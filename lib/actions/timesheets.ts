'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '../db';
import { timeEntrySchema } from '../validators/timesheets';

export async function createTimesheet(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = timeEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const {
    projectId,
    userId: entryUserId,
    date,
    hoursWorked,
    overtime,
    description,
  } = parsed.data;

  const entry = await prisma.timeEntry.create({
    data: {
      projectId,
      userId: entryUserId,
      date: new Date(date),
      hoursWorked,
      overtime: overtime ?? 0,
      description: description || null,
      approved: false,
    },
    include: {
      project: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
    },
  });

  revalidatePath('/dashboard/timesheets');
  return { success: true, id: entry.id };
}

export async function updateTimesheet(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = timeEntrySchema.safeParse(raw);
  if (!parsed.success || !parsed.data.id) {
    return { error: 'Invalid input' };
  }

  const {
    id,
    projectId,
    userId: entryUserId,
    date,
    hoursWorked,
    overtime,
    description,
  } = parsed.data;

  const entry = await prisma.timeEntry.update({
    where: { id },
    data: {
      projectId,
      userId: entryUserId,
      date: new Date(date),
      hoursWorked,
      overtime: overtime ?? 0,
      description: description || null,
    },
    include: {
      project: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
    },
  });

  revalidatePath('/dashboard/timesheets');
  revalidatePath(`/dashboard/timesheets/${id}`);
  return { success: true, id: entry.id };
}

export async function approveTimesheet(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return { error: 'Invalid entry' };
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERVISOR')) {
    return { error: 'Insufficient permissions' };
  }

  await prisma.timeEntry.update({
    where: { id },
    data: {
      approved: true,
      approvedById: dbUser.id,
    },
  });

  revalidatePath('/dashboard/timesheets');
  revalidatePath(`/dashboard/timesheets/${id}`);
  return { success: true };
}
