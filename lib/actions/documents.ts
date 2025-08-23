'use server';

import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { documentSchema } from '../validators/documents';
import type { DocumentType } from '@prisma/client';

export async function createDocument(_: unknown, formData: FormData) {
  const user = await currentUser();
    if (!user) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = documentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { title, description, type: docType, projectId } = parsed.data;
  const file = formData.get('file') as File | null;
  if (!file || !file.name) {
    return { error: 'File required' };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: 'Storage token not configured' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const blob = await put(filename, buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type,
  });

  const doc = await prisma.document.create({
    data: {
      title,
      type: docType as DocumentType,
      projectId: projectId && projectId !== 'NO_PROJECT' ? projectId : null,
      url: blob.url,
      mimeType: file.type,
      fileSize: file.size,
      uploadedById: user.id,
    },
  });

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents/${doc.id}`);
}

export async function updateDocument(_: unknown, formData: FormData) {
  const user = await currentUser();
    if (!user) {
    return { error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = documentSchema.required({ id: true }).safeParse(raw);
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  const { id, title, description, type: docType, projectId } = parsed.data;

  await prisma.document.update({
    where: { id },
    data: {
      title,
      type: docType as DocumentType,
      projectId: projectId && projectId !== 'NO_PROJECT' ? projectId : null,
    },
  });

  revalidatePath('/dashboard/documents');
  redirect(`/dashboard/documents/${id}`);
}
