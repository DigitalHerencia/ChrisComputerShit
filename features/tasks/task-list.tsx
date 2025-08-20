import { prisma } from '@/lib/db'
import { TaskCard } from '@/components/tasks/task-card'

interface TaskListProps {
  projectId: string
}

export async function TaskList({ projectId }: TaskListProps) {
  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
