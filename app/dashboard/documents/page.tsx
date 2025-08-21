import { Suspense } from 'react';
import { DocumentList } from '@/features/documents/document-list';
import DocumentsLoading from '@/app/dashboard/documents/loading';
interface PageProps {
  searchParams: Promise<{ search?: string; type?: string; project?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<DocumentsLoading />}>
      <DocumentList searchParams={ {
        search: undefined,
        type: undefined,
        project: undefined
      } }  />
    </Suspense>
  );
}
