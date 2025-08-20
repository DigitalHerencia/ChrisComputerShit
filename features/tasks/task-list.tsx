import { TaskCard } from '@/components/tasks/task-card'
import { getTasks } from '@/lib/fetchers/tasks'

interface TaskListProps {
  projectId?: string
}

export async function TaskList({ projectId }: TaskListProps = {}) {
  const tasks = await getTasks(projectId)

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
