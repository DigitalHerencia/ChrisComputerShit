import ProjectList from '@/components/projects/ProjectList';
import { getProjects } from './getProjects';

interface Props {
  userId: string;
}

export default async function DashboardProjects({ userId }: Props) {
  const projects = await getProjects(userId);
  return <ProjectList projects={projects} />;
}
