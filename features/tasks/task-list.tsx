import Link from 'next/link'
import { TaskCard } from '@/components/tasks/task-card'
import { getTasks } from '@/lib/fetchers/tasks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ClipboardList } from 'lucide-react'

interface TaskListProps {
  projectId?: string
}

export async function TaskList({ projectId }: TaskListProps = {}) {
  const tasks = await getTasks(projectId)

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first task
            </p>
            <Button asChild>
              <Link href="/dashboard/tasks/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
