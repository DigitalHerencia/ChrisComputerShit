import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    entity: { create: vi.fn() },
  },
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createContact } from './contacts';

describe('createContact', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates a contact with valid data', async () => {
    const form = new Map([
      ['type', 'CLIENT'],
      ['name', 'ACME Corp'],
      ['phone', '555-1234'],
      ['email', 'test@acme.com'],
    ]);

    (prisma.entity.create as any).mockResolvedValue({ id: 'e1' });

    const res = await createContact(undefined, form as unknown as FormData);

    expect(prisma.entity.create).toHaveBeenCalledWith({
      data: { type: 'CLIENT', name: 'ACME Corp', phone: '555-1234', email: 'test@acme.com' },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/contacts');
    expect(res).toEqual({ success: true });
  });

  it('returns error for invalid input', async () => {
    const form = new Map([['type', 'CLIENT']]); // missing name
    const res = await createContact(undefined, form as unknown as FormData);
    expect(res).toEqual({ error: 'Invalid input' });
    expect(prisma.entity.create).not.toHaveBeenCalled();
  });
});
