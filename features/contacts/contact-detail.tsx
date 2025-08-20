import { getContact } from '@/lib/fetchers/contacts'
import { notFound } from 'next/navigation'

interface ContactDetailProps {
  id: string
}

export async function ContactDetail({ id }: ContactDetailProps) {
  const contact = await getContact(id)
  if (!contact) {
    notFound()
  }
  return (
    <div className="rounded-md shadow-md bg-black p-6 border border-gray-200 space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{contact.name}</h2>
      <p className="text-sm text-muted-foreground">Type: {contact.type.replace('_', ' ')}</p>
      {contact.phone && (
        <p className="text-sm text-muted-foreground">Phone: {contact.phone}</p>
      )}
      {contact.email && (
        <p className="text-sm text-muted-foreground">Email: {contact.email}</p>
      )}
    </div>
  )
}
