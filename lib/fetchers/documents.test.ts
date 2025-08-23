import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma: any = {
  document: { findMany: vi.fn(), groupBy: vi.fn() },
  project: { findMany: vi.fn() },
};

vi.mock('@/lib/db', () => ({ prisma: mockPrisma }));

import { getDocuments, getProjects, getDocumentTypeCounts } from '@/lib/fetchers/documents';

beforeEach(() => {
  mockPrisma.document.findMany.mockReset();
  mockPrisma.document.groupBy.mockReset();
  mockPrisma.project.findMany.mockReset();
});

describe('documents fetcher', () => {
  it('getDocuments returns results from prisma.document.findMany', async () => {
    const expected = [{ id: 'd1', title: 'Doc' }];
    mockPrisma.document.findMany.mockResolvedValue(expected);

    const res = await getDocuments({ search: 'Doc' });

    expect(mockPrisma.document.findMany).toHaveBeenCalled();
    expect(res).toEqual(expected);
  });

  it('getProjects returns projects list', async () => {
    mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1', name: 'P' }]);
    const res = await getProjects();
    expect(res).toHaveLength(1);
  });

  it('getDocumentTypeCounts calls groupBy', async () => {
    mockPrisma.document.groupBy.mockResolvedValue([{ type: 'PLANS', _count: { type: 2 } }]);
    const res = await getDocumentTypeCounts();
    expect(mockPrisma.document.groupBy).toHaveBeenCalled();
    expect(res).toHaveLength(1);
  });
});
