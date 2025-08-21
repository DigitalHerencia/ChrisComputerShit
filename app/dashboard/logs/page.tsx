import { Suspense } from 'react';
import { LogList } from '@/features/logs/log-list';

interface PageProps {
  searchParams: Promise<{ q?: string; project?: string; range?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <LogList searchParams={params} />
      </Suspense>
    </div>
  );
}
