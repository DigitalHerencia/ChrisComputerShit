import { Suspense } from 'react';
import { LogNew } from '@/features/logs/log-new';

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <LogNew />
      </Suspense>
    </div>
  );
}
