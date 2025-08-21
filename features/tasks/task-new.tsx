import { prisma } from '@/lib/db';
import { TaskForm } from '@/components/tasks/task-form';

export async function TaskNew() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return <TaskForm projects={projects} />;
}
