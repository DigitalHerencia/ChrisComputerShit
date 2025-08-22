import { describe, it, expect, vi } from 'vitest';
import { prisma } from './db';

describe('prisma neon integration', () => {
  it('executes raw query', async () => {
    const mock = vi.spyOn(prisma, '$queryRaw').mockResolvedValue([{ ok: 1 }] as unknown);
    const result = await prisma.$queryRaw`select 1 as ok`;
    expect(result).toEqual([{ ok: 1 }]);
    mock.mockRestore();
  });
});
