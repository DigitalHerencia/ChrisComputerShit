import { Suspense } from 'react';
import { TimesheetList } from '@/features/timesheets/timesheet-list';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    project?: string;
    user?: string;
  }>;
}

export default async function TimesheetsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timesheets</h1>
          <p className="text-muted-foreground">
            Track hours and manage payroll
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Loading timesheets...</div>}>
        <TimesheetList searchParams={sp} />
      </Suspense>
    </div>
  );
}
