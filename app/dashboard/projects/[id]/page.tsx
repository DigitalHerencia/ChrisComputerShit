import ProjectDetails from '@/features/projects/project-details';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectDetails params={{ id }} />
    </Suspense>
  );
}