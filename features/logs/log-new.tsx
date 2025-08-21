import { LogForm } from '@/components/logs/log-form';
import { getProjects } from '@/lib/fetchers/projects';

export async function LogNew() {
  const projects = await getProjects();
  return <LogForm projects={projects} />;
}
