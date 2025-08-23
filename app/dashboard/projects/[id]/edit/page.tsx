import EditProjectFeature from '@/features/projects/project-edit';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return <EditProjectFeature params={params} />;
}
