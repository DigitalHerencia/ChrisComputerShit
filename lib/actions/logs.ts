'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { redirect } from 'next/navigation';
import { z } from "zod";
import { prisma } from '@/lib/db';
import { logSchema } from '../validators/logs';

export async function createDailyLog(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = logSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { projectId, date, weather, crewCount, workDone, notes } = parsed.data;

  const log = await prisma.dailyLog.create({
    data: {
      projectId,
      date: new Date(date),
      weather,
      crewCount,
      workDone,
      notes,
      createdById: userId,
    },
  });

  const files = formData.getAll('photos') as File[];
  if (files.length) {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!file || !file.name) continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${log.id}-${Date.now()}-${file.name}`;
      await writeFile(join(uploadDir, filename), buffer);
      await prisma.logPhoto.create({
        data: {
          logId: log.id,
          url: `/uploads/${filename}`,
        },
      });
    }
  }

  revalidatePath('/dashboard/logs');
  return { success: true, id: log.id };
}

export async function deleteDailyLog(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return { error: 'Invalid log' };
  }

  await prisma.dailyLog.delete({ where: { id } });
  revalidatePath('/dashboard/logs');
  redirect('/dashboard/logs');
}

export async function updateDailyLog(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = logSchema.extend({ id: z.string() }).safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { id, projectId, date, weather, crewCount, workDone, notes } = parsed.data;

  await prisma.dailyLog.update({
    where: { id },
    data: {
      projectId,
      date: new Date(date),
      weather,
      crewCount,
      workDone,
      notes,
    },
  });

  revalidatePath('/dashboard/logs');
  redirect(`/dashboard/logs/${id}`);
}
