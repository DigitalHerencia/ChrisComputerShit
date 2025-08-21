import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus } from 'lucide-react';
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
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/timesheets/payroll">
              <DollarSign className="h-4 w-4 mr-2" />
              Payroll Report
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/timesheets/new">
              <Plus className="h-4 w-4 mr-2" />
              Log Hours
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading timesheets...</div>}>
        <TimesheetList searchParams={sp} />
      </Suspense>
    </div>
  );
}
