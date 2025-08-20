import { Suspense } from 'react'
import { TaskNew } from '@/features/tasks/task-new'

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <TaskNew />
      </Suspense>
    </div>
  )
}
