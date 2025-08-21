'use server';

import { prisma } from '../db';
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
