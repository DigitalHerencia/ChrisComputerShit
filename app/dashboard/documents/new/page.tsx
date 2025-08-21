import { Suspense } from 'react';
import { DocumentNew } from '@/features/documents/document-new';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentNew />
    </Suspense>
  );
}
