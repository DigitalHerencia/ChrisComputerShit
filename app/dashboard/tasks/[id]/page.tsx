import { Suspense } from 'react';
import { TaskDetail } from '@/features/tasks/task-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading task...</div>}>
        <TaskDetail id={id} />
      </Suspense>
    </div>
  );
}
