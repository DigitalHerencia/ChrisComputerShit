import { notFound } from 'next/navigation'
import { getTask } from '@/lib/fetchers/tasks'

interface TaskDetailProps {
  id: string
}

export async function TaskDetail({ id }: TaskDetailProps) {
  const task = await getTask(id)

  if (!task) {
    notFound()
  }

  return (
    <div className="rounded-md shadow-md bg-black p-6 border border-gray-200 space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{task.title}</h2>
      <p className="text-sm text-muted-foreground">
        Status: {task.status.replace('_', ' ')}
      </p>
      {task.dueDate && (
        <p className="text-sm text-muted-foreground">
          Due {task.dueDate.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
