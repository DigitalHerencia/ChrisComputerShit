'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { prisma } from '@/lib/db';
import { documentSchema } from '../validators/documents';

export async function createDocument(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = documentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { title, description, type, projectId } = parsed.data;
  const file = formData.get('file') as File | null;
  if (!file || !file.name) {
    return { error: 'File required' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${file.name}`;
  await writeFile(join(uploadDir, filename), buffer);

  const doc = await prisma.document.create({
    data: {
      title,
      description,
      type,
      projectId: projectId && projectId !== 'NO_PROJECT' ? projectId : null,
      uploadedById: userId,
      filePath: `/uploads/${filename}`,
      mimeType: file.type,
      fileSize: file.size,
    },
  });

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents/${doc.id}`);
}

export async function updateDocument(_: unknown, formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = documentSchema.required({ id: true }).safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { id, title, description, type, projectId } = parsed.data;

  await prisma.document.update({
    where: { id },
    data: {
      title,
      description,
      type,
      projectId: projectId && projectId !== 'NO_PROJECT' ? projectId : null,
    },
  });

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents/${id}`);
}
