import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DocumentForm } from '@/components/documents/document-form';
import { getDocument } from '@/lib/fetchers/documents';
import { getProjects } from '@/lib/fetchers/projects';
import { updateDocument } from '@/lib/actions/documents';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({ params }: PageProps) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return null;

  const [document, projects] = await Promise.all([
    getDocument(id),
    getProjects(),
  ]);

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/documents/${document.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Document</h1>
          <p className="text-muted-foreground">Update document information</p>
        </div>
      </div>

      {/* Form */}
      <DocumentForm
        projects={projects}
        document={document}
        action={updateDocument}
      />
    </div>
  );
}
