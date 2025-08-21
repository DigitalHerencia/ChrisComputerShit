import { EntityType } from '@prisma/client';
import { prisma } from '../db';

interface ContactFilters {
  q?: string;
  type?: EntityType;
}

export async function getContacts(filters: ContactFilters = {}) {
  const { q, type } = filters;
  return prisma.entity.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { name: 'asc' },
  });
}

export async function getContact(id: string) {
  return prisma.entity.findUnique({ where: { id } });
}

export async function getContactsByType(type: EntityType) {
  return getContacts({ type });
}

export const getClients = () => getContactsByType(EntityType.CLIENT);
export const getContractors = () => getContactsByType(EntityType.CONTRACTOR);
export const getVendors = () => getContactsByType(EntityType.VENDOR);
export const getInspectors = () => getContactsByType(EntityType.INSPECTOR);
export const getEmployees = () => getContactsByType(EntityType.EMPLOYEE);
export const getBurritoTrucks = () =>
  getContactsByType(EntityType.BURRITO_TRUCK);
