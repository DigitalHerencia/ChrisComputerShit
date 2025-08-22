import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;
  return getUserByClerkId(userId);
}
