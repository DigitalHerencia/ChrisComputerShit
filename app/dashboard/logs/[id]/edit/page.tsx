import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { LogForm } from '@/components/logs/log-form';
import { getDailyLog } from '@/lib/fetchers/logs';
import { getProjects } from '@/lib/fetchers/projects';
import { updateDailyLog } from '@/lib/actions/logs';

export default async function EditDailyLogPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) return null;

  const [dailyLog, projects] = await Promise.all([
    getDailyLog(params.id),
    getProjects(),
  ]);

  if (!dailyLog) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Daily Log</h1>
        <p className="text-muted-foreground">Update log information</p>
      </div>

      <LogForm projects={projects} log={dailyLog} action={updateDailyLog} />
    </div>
  );
}
