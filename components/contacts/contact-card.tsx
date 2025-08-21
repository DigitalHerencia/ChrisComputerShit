import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    type: string;
    phone?: string | null;
    email?: string | null;
  };
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Link href={`/dashboard/contacts/${contact.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            {contact.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {contact.type.replace('_', ' ')}
          </p>
        </CardHeader>
        {(contact.phone || contact.email) && (
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {contact.phone && <p>Phone: {contact.phone}</p>}
            {contact.email && <p>Email: {contact.email}</p>}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
