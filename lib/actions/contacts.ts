'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { contactSchema } from '../validators/contacts';

export async function createContact(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  const { type, name, phone, email } = parsed.data;
  await prisma.entity.create({
    data: { type, name, phone, email },
  });
  revalidatePath('/dashboard/contacts');
  return { success: true };
}

export async function updateContact(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData);
  // id will be provided as a string in the form
  const id = typeof raw.id === 'string' ? raw.id : (raw.id as any)?.toString?.();
  if (!id) {
    return { error: 'Missing id' };
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  const { type, name, phone, email } = parsed.data;
  await prisma.entity.update({ where: { id }, data: { type, name, phone, email } });
  // revalidate list and detail pages
  revalidatePath('/dashboard/contacts');
  revalidatePath(`/dashboard/contacts/${id}`);
  return { success: true };
}
