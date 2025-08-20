import { Suspense } from 'react'
import { TimesheetNew } from '@/features/timesheets/timesheet-new'

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <TimesheetNew />
      </Suspense>
    </div>
  )
}
