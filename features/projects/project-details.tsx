import { currentUser } from '@clerk/nextjs/server';
import { getProject } from '@/lib/fetchers/projects';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const project = await getProject(params.id);
  if (!project) return notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
        <p className="text-muted-foreground">Project details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Location</dt>
              <dd>{project.location || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>{project.status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
