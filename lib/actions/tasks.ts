'use server';

import { prisma } from '../db';
import { revalidatePath } from 'next/cache';
import { taskSchema } from '../validators/tasks';

export async function createTask(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  const { projectId, title, dueDate } = parsed.data;
  await prisma.task.create({
    data: {
      projectId,
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });
  revalidatePath('/dashboard/tasks');
  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}
