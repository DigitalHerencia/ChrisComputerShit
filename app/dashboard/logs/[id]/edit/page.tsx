import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { DailyLogForm } from '@/components/logs/daily-log-form';

export default async function EditDailyLogPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) return null;

  const [dailyLog, projects] = await Promise.all([
    prisma.dailyLog.findUnique({
      where: { id: params.id },
    }),
    prisma.project.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
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

      <DailyLogForm projects={projects} log={dailyLog} />
    </div>
  );
}
