import { prisma } from '@/lib/db'
import { LogForm } from '@/components/logs/log-form'

export async function LogNew() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
  return <LogForm projects={projects} />
}
