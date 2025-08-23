import { prisma } from '@/lib/db';
import { TimesheetForm } from '@/components/timesheets/timesheet-form';

export async function TimesheetNew() {
  const [projects, users] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, clerkId: true },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  return <TimesheetForm projects={projects} users={users} />;
}
