import { Suspense } from 'react';
import { LogList } from '@/features/logs/log-list';
import LogsLoading from '@/app/dashboard/logs/loading';

interface PageProps {
  searchParams: Promise<{ q?: string; project?: string; range?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense fallback={<LogsLoading />}>
        <LogList searchParams={params} />
      </Suspense>
    </div>
  );
}
