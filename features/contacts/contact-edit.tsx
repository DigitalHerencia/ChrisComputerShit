import { ContactForm } from '@/components/contacts/contact-form';
import { getContact } from '@/lib/fetchers/contacts';
import { notFound } from 'next/navigation';

interface ContactEditProps {
  id: string;
}

export async function ContactEdit({ id }: ContactEditProps) {
  const contact = await getContact(id);
  if (!contact) {
    notFound();
  }
  return (
    // pass current values to form and set edit mode
    <ContactForm
      id={contact.id}
      edit
      defaultValues={{
        type: contact.type,
        name: contact.name,
        phone: contact.phone ?? undefined,
        email: contact.email ?? undefined,
      }}
    />
  );
}
