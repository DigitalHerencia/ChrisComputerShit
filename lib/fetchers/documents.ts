import { prisma } from '@/lib/db';
import { Prisma, DocumentType } from '@prisma/client';

export interface DocumentFilters {
  search?: string;
  type?: DocumentType | 'all';
  project?: string;
  user?: string;
}

export async function getDocuments(filters: DocumentFilters = {}) {
  const where: Prisma.DocumentWhereInput = {};

  if (filters.type && filters.type !== 'all') {
  // cast since filters.type can be 'all' or a DocumentType
  where.type = filters.type as DocumentType;
  }

  if (filters.project && filters.project !== 'all') {
    where.projectId = filters.project;
  }

  if (filters.search) {
    where.OR = [
  { title: { contains: filters.search, mode: 'insensitive' } },
  { url: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.document.findMany({
    where,
    include: {
      project: { select: { name: true } },
      uploadedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getDocument(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      project: { select: { name: true } },
      uploadedBy: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export async function getDocumentTypeCounts() {
  return prisma.document.groupBy({
    by: ['type'],
    _count: { type: true },
  });
}
