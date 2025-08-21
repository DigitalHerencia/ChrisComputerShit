import { prisma } from '@/lib/db';

interface DocumentFilters {
  search?: string;
  type?: string;
  project?: string;
}

export async function getDocuments(filters: DocumentFilters = {}) {
  const { search, type, project } = filters;
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (type && type !== 'all') {
    where.type = type;
  }

  if (project && project !== 'all') {
    where.projectId = project;
  }

  return prisma.document.findMany({
    where,
    include: {
      project: { select: { name: true } },
      uploadedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDocument(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true, location: true } },
      uploadedBy: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function getDocumentStats() {
  return prisma.document.groupBy({
    by: ['type'],
    _count: { type: true },
  });
}
