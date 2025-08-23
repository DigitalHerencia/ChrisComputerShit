import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({ prisma: { project: { create: vi.fn(), update: vi.fn() } } }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProject, updateProject } from './projects';

describe('projects actions', () => {
  beforeEach(() => vi.resetAllMocks());

  it('createProject creates project and redirects', async () => {
    const form = new Map([
      ['name', 'P'],
      ['description', 'D'],
      ['location', 'L'],
      ['status', 'ACTIVE'],
      ['startDate', '2020-01-01'],
      ['endDate', '2020-01-02'],
      ['clientId', 'defaultClientId'],
    ]);

    (prisma.project.create as any).mockResolvedValue({ id: 'proj1' });

    await createProject(undefined, form as unknown as FormData);

    expect(prisma.project.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/projects');
    expect(redirect).toHaveBeenCalledWith('/dashboard/projects/proj1');
  });

  it('updateProject updates and redirects', async () => {
    const form = new Map([
      ['id', 'proj1'],
      ['name', 'P'],
      ['description', 'D'],
      ['location', 'L'],
      ['status', 'ACTIVE'],
    ]);

    (prisma.project.update as any).mockResolvedValue({ id: 'proj1' });

    await updateProject(undefined, form as unknown as FormData);

    expect(prisma.project.update).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/projects');
    expect(redirect).toHaveBeenCalledWith('/dashboard/projects/proj1');
  });
});
