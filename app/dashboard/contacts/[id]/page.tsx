import { Suspense } from 'react';
import Link from 'next/link';
import { ContactDetail } from '@/features/contacts/contact-detail';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Contact Details
          </h1>
          <p className="text-muted-foreground">View contact information</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/contacts">Back</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading contact...</div>}>
        <ContactDetail id={id} />
      </Suspense>
    </div>
  );
}
