import { Suspense } from 'react';
import { TaskCreate } from '@/features/tasks/task-create';

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <TaskCreate />
      </Suspense>
    </div>
  );
}
