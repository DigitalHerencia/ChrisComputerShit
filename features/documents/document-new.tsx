import { currentUser } from '@clerk/nextjs/server';
import { DocumentForm } from '@/components/documents/document-form';
import { getProjects } from '@/lib/fetchers/projects';
import { createDocument } from '@/lib/actions/documents';

export async function DocumentNew() {
  const user = await currentUser();
  if (!user) return null;

  const projects = await getProjects();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Document</h1>
        <p className="text-muted-foreground">
          Add a new document to your projects
        </p>
      </div>

  <DocumentForm projects={projects} />
    </div>
  );
}
