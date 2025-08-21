import { prisma } from '@/lib/db';
import { TaskForm } from '@/components/tasks/task-form';

interface TaskCreateProps {
  projectId?: string;
}

export async function TaskCreate({ projectId }: TaskCreateProps) {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="rounded-md shadow-md bg-card p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-foreground">New Task</h2>
      <TaskForm projectId={projectId} projects={projects} />
    </div>
  );
}
