import { Suspense } from 'react'
import Link from 'next/link'
import { TaskList } from '@/features/tasks/task-list'
import { Button } from '@/components/ui/button'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Browse all tasks</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks/new">Add Task</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList />
      </Suspense>
    </div>
  )
}
