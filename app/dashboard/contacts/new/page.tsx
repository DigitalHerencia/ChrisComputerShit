import { Suspense } from 'react'
import { ContactNew } from '@/features/contacts/contact-new'

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ContactNew />
      </Suspense>
    </div>
  )
}
