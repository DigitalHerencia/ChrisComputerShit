import { Suspense } from 'react'
import { ContactDetail } from '@/features/contacts/contact-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading contact...</div>}>
        <ContactDetail id={id} />
      </Suspense>
    </div>
  )
}
