import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContact } from '@/lib/fetchers/contacts';
import { notFound } from 'next/navigation';

interface ContactDetailProps {
  id: string;
}

export async function ContactDetail({ id }: ContactDetailProps) {
  const contact = await getContact(id);
  if (!contact) {
    notFound();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Type: {contact.type.replace('_', ' ')}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {contact.phone && <p>Phone: {contact.phone}</p>}
        {contact.email && <p>Email: {contact.email}</p>}
      </CardContent>
    </Card>
  );
}
