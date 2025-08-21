import { Suspense } from 'react';
import Link from 'next/link';
import { ContactNew } from '@/features/contacts/contact-new';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Contact</h1>
          <p className="text-muted-foreground">Add a new contact</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/contacts">Cancel</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactNew />
      </Suspense>
    </div>
  );
}
