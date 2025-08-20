import { Suspense } from 'react'
import { DocumentNew } from '@/features/documents/document-new'

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentNew />
      </Suspense>
    </div>
  )
}
