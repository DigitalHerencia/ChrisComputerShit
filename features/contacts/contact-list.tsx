import { EntityType } from '@prisma/client'
import { getContacts } from '@/lib/fetchers/contacts'
import { ContactCard } from '@/components/contacts/contact-card'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface ContactListProps {
  search?: string
  type?: string
}

export async function ContactList({ search, type }: ContactListProps) {
  const contacts = await getContacts({ q: search, type: type as EntityType })
  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
            <p className="text-muted-foreground">
              Get started by adding your first contact
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} />
      ))}
    </div>
  )
}
