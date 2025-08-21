import { Suspense } from 'react'
import { DocumentList } from '@/features/documents/document-list'

interface PageProps {
  searchParams: Promise<{ search?: string; type?: string; project?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentList searchParams={params} />
    </Suspense>
  )
}
