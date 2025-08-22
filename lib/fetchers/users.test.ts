import { describe, it, expect, vi } from 'vitest';

const findUnique = vi.hoisted(() => vi.fn().mockResolvedValue({
  id: 'u1',
  clerkId: 'clerk_test',
  email: 'test@example.com',
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique,
    },
  },
}));

vi.mock('@clerk/nextjs/server', () => ({ auth: () => ({ userId: 'clerk_test' }) }));

import { getCurrentUser } from './users';

describe('getCurrentUser', () => {
  it('queries user by Clerk ID from Prisma', async () => {
    const user = await getCurrentUser();
    expect(findUnique).toHaveBeenCalledWith({ where: { clerkId: 'clerk_test' } });
    expect(user?.email).toBe('test@example.com');
  });
});
