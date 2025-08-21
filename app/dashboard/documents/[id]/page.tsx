import { Suspense } from 'react';
import { DocumentDetail } from '@/features/documents/document-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentDetail id={id} />
    </Suspense>
  );
}

