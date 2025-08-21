import { Suspense } from 'react';
import { DocumentEdit } from '@/features/documents/document-edit';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentEdit id={id} />
    </Suspense>
  );
}

