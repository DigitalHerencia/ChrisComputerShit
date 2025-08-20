import { Suspense } from 'react'
import { TaskCreate } from '@/features/tasks/task-create'

interface PageProps {
  searchParams: Promise<{ project?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { project } = await searchParams
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Add Task</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskCreate projectId={project} />
      </Suspense>
    </div>
  )
}
