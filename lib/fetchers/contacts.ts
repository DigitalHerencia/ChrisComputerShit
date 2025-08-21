import { EntityType } from '@prisma/client'
import { prisma } from '../db'

interface ContactFilters {
  q?: string
  type?: EntityType
}

export async function getContacts(filters: ContactFilters = {}) {
  const { q, type } = filters
  return prisma.entity.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { name: 'asc' },
  })
}

export async function getContact(id: string) {
  return prisma.entity.findUnique({ where: { id } })
}
