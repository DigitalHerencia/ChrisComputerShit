'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { projectSchema } from '../validators/projects';
import { z } from 'zod';

export async function createProject(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  const { name, description, location, status, startDate, endDate, clientId } =
    parsed.data;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      location,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      clientId: clientId && clientId !== 'defaultClientId' ? clientId : null,
      createdById: 'clerkUserId',
    },
  });
  revalidatePath('/dashboard/projects');
  redirect(`/dashboard/projects/${project.id}`);
}

export async function updateProject(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = projectSchema.extend({ id: z.string() }).safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  const { id, name, description, location, status, startDate, endDate, clientId } =
    parsed.data;
  await prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      location,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      clientId: clientId && clientId !== 'defaultClientId' ? clientId : null,
    },
  });
  revalidatePath('/dashboard/projects');
  redirect(`/dashboard/projects/${id}`);
}
