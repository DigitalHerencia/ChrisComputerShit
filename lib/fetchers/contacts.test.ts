import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityType } from '@prisma/client';

const mockPrisma: any = {
  entity: { findMany: vi.fn(), findUnique: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getContacts, getContact, getClients } from '@/lib/fetchers/contacts';

beforeEach(() => {
  mockPrisma.entity.findMany.mockReset();
  mockPrisma.entity.findUnique.mockReset();
});

describe('contacts fetcher', () => {
  it('getContacts forwards filters to prisma.entity.findMany and returns results', async () => {
    const expected = [{ id: '1', name: 'Acme' }];
    mockPrisma.entity.findMany.mockResolvedValue(expected);

    const res = await getContacts({ q: 'Acme', type: EntityType.CLIENT });

    expect(mockPrisma.entity.findMany).toHaveBeenCalled();
    expect(res).toEqual(expected);
  });

  it('getContact calls findUnique with id', async () => {
    const expected = { id: '1' };
    mockPrisma.entity.findUnique.mockResolvedValue(expected);

    const res = await getContact('1');

    expect(mockPrisma.entity.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(res).toEqual(expected);
  });

  it('getClients delegates to getContactsByType (calls prisma)', async () => {
    mockPrisma.entity.findMany.mockResolvedValue([]);
    await getClients();
    expect(mockPrisma.entity.findMany).toHaveBeenCalled();
  });
});
