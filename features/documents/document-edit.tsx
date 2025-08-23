import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DocumentForm } from '@/components/documents/document-form';
import { getDocument } from '@/lib/fetchers/documents';
import { getProjects } from '@/lib/fetchers/projects';
import { updateDocument } from '@/lib/actions/documents';

interface DocumentEditProps {
  id: string;
}

export async function DocumentEdit({ id }: DocumentEditProps) {
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
        document={{
          id: document.id,
          title: document.title,
          description: typeof (document as any).description === 'string' ? (document as any).description : null,
          type: document.type,
          projectId: document.projectId ?? null,
        }}
      />
    </div>
  );
}

