import { Suspense } from 'react'
import Link from 'next/link'
import { ContactList } from '@/features/contacts/contact-list'
import { Button } from '@/components/ui/button'

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Browse all contacts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contacts/new">Add Contact</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactList />
      </Suspense>
    </div>
  )
}
