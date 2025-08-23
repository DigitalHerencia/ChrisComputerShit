import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{contact.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="text-sm text-muted-foreground">
          Type: {contact.type.replace('_', ' ')}
        </p>
        {contact.phone && <p>Phone: {contact.phone}</p>}
        {contact.email && <p>Email: {contact.email}</p>}
        <div className="flex justify-end mt-2">
          <Button asChild>
            <Link href={`/dashboard/contacts/${contact.id}/edit`}>Edit Contact</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
