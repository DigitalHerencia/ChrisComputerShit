'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createDailyLog, updateDailyLog } from '@/lib/actions/logs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LogFormProps {
  projects: { id: string; name: string }[];
  log?: {
    id: string;
    projectId: string;
    date: Date;
    weather?: string | null;
    crewCount?: number | null;
    workDone: string;
    notes?: string | null;
  };
}

export function LogForm({ projects, log }: LogFormProps) {
  const actionFn = log ? updateDailyLog : createDailyLog;
  const [state, formAction] = useActionState(actionFn as any, undefined);
  return (
    <form action={formAction} className="space-y-4">
      {log && <input type="hidden" name="id" value={log.id} />}
      <div className="space-y-2">
        <Label htmlFor="projectId">Project</Label>
        <select
          id="projectId"
          name="projectId"
          className="w-full rounded-md border border-gray-200 bg-card p-2 text-foreground"
          defaultValue={log?.projectId || ''}
          required
        >
          <option value="" disabled>
            Select project
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            name="date"
            defaultValue={
              log ? new Date(log.date).toISOString().split('T')[0] : undefined
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weather">Weather</Label>
          <Input
            id="weather"
            name="weather"
            placeholder="e.g. Sunny"
            defaultValue={log?.weather || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crewCount">Crew Count</Label>
          <Input
            id="crewCount"
            name="crewCount"
            type="number"
            min="0"
            defaultValue={log?.crewCount?.toString() || ''}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workDone">Work Performed</Label>
        <Textarea
          id="workDone"
          name="workDone"
          required
          rows={4}
          defaultValue={log?.workDone || ''}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={log?.notes || ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="photos">Photos</Label>
        <Input
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
        />
      </div>
      <SubmitButton label={log ? 'Update Log' : 'Save Log'} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : label}
    </Button>
  );
}
