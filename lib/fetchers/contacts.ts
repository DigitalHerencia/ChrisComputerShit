import { prisma } from '../db'

export async function getContacts() {
  return prisma.entity.findMany({ orderBy: { name: 'asc' } })
}

export async function getContact(id: string) {
  return prisma.entity.findUnique({ where: { id } })
}
