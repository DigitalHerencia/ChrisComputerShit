import Link from 'next/link'

interface ContactCardProps {
  contact: {
    id: string
    name: string
    type: string
    phone?: string | null
    email?: string | null
  }
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Link href={`/dashboard/contacts/${contact.id}`} className="block">
      <div className="rounded-md shadow-md bg-black p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
        <p className="text-sm text-muted-foreground">
          {contact.type.replace('_', ' ')}
        </p>
      </div>
    </Link>
  )
}
