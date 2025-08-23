import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({ currentUser: vi.fn() }));
vi.mock('@/lib/db', () => ({ prisma: { document: { create: vi.fn(), update: vi.fn() } } }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@vercel/blob', () => ({ put: vi.fn() }));

import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { createDocument, updateDocument } from './documents';

describe('documents actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('createDocument stores file and creates db record', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    process.env.BLOB_READ_WRITE_TOKEN = 'token';

    const fakeFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const form = new Map<string, FormDataEntryValue>([
      ['title', 'T'],
      ['description', 'D'],
      ['type', 'GENERIC'],
      ['projectId', 'NO_PROJECT'],
      ['file', fakeFile as unknown as File],
    ]);

    (put as any).mockResolvedValue({ url: 'https://blob/1' });
    (prisma.document.create as any).mockResolvedValue({ id: 'doc1' });

    await createDocument(undefined, form as unknown as FormData);

    expect(put).toHaveBeenCalled();
    expect(prisma.document.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/documents');
    expect(redirect).toHaveBeenCalled();
  });

  it('createDocument errors when unauthorized', async () => {
    (currentUser as any).mockResolvedValue(null);
    const form = new Map();
    const res = await createDocument(undefined, form as unknown as FormData);
    expect(res).toEqual({ error: 'Unauthorized' });
  });

  it('updateDocument updates record and redirects', async () => {
    (currentUser as any).mockResolvedValue({ id: 'clerk-1' });
    const form = new Map<string, FormDataEntryValue>([
      ['id', 'doc1'],
      ['title', 'T'],
      ['description', 'D'],
      ['type', 'GENERIC'],
      ['projectId', 'NO_PROJECT'],
    ]);

    (prisma.document.update as any).mockResolvedValue({ id: 'doc1' });

    await updateDocument(undefined, form as unknown as FormData);

    expect(prisma.document.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/documents');
    expect(redirect).toHaveBeenCalledWith('/dashboard/documents/doc1');
  });
});
