import { getContacts } from '@/lib/fetchers/contacts'
import { ContactCard } from '@/components/contacts/contact-card'

export async function ContactList() {
  const contacts = await getContacts()
  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} />
      ))}
    </div>
  )
}
