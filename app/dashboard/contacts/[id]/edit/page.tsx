import { Suspense } from 'react';
import Link from 'next/link';
import { ContactEdit } from '@/features/contacts/contact-edit';
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
          <h1 className="text-3xl font-bold text-foreground">Edit Contact</h1>
          <p className="text-muted-foreground">Update contact information</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/contacts/${id}`}>Cancel</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactEdit id={id} />
      </Suspense>
    </div>
  );
}
