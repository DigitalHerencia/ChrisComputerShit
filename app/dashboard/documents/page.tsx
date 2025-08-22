import { Suspense } from 'react';
import { DocumentList } from '@/features/documents/document-list';
import DocumentsLoading from '@/app/dashboard/documents/loading';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    project?: string;
    user?: string;
  }>;
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
return (
    <div className="space-y-6">
      <Suspense fallback={<DocumentsLoading />}>
        <DocumentList searchParams={sp} />
      </Suspense>
    </div>
  );
}
