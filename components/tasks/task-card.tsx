interface TaskCardProps {
  task: {
    id: string
    title: string
    status: string
    dueDate?: Date | null
  }
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="rounded-md shadow-md bg-black p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
        <span className="text-sm text-muted-foreground">{task.status.replace('_', ' ')}</span>
      </div>
      {task.dueDate && (
        <p className="mt-2 text-sm text-muted-foreground">Due {task.dueDate.toLocaleDateString()}</p>
      )}
    </div>
  )
}
