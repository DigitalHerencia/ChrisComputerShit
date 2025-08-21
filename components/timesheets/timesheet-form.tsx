'use client';

import type React from 'react';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { createTimesheet, updateTimesheet } from '@/lib/actions/timesheets';
import { useFormStatus } from 'react-dom';

interface TimesheetFormProps {
  projects: { id: string; name: string }[];
  users: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    clerkId: string;
  }[];
  defaultProjectId?: string;
  entry?: {
    id: string;
    projectId: string;
    userId: string;
    date: Date;
    hoursWorked: number;
    overtime: number;
    description?: string | null;
  };
}

export function TimesheetForm({
  projects,
  users,
  defaultProjectId,
  entry,
}: TimesheetFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const currentDbUser = users.find((u) => u.clerkId === user?.id);

  const actionFn = entry ? updateTimesheet : createTimesheet;
  const [state, formAction] = useActionState(actionFn, undefined);

  const [hoursWorked, setHoursWorked] = useState(
    entry?.hoursWorked?.toString() || ''
  );
  const [overtime, setOvertime] = useState(entry?.overtime?.toString() || '0');

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
    if (state.success && state.id) {
      toast({
        title: entry ? 'Timesheet updated' : 'Hours logged',
        description: `${hoursWorked} hours have been ${entry ? 'updated' : 'logged'} successfully.`,
      });
      router.push(`/dashboard/timesheets/${state.id}`);
    }
  }, [state, toast, router, entry, hoursWorked]);

  const totalHours = (
    Number.parseFloat(hoursWorked || '0') + Number.parseFloat(overtime || '0')
  ).toFixed(1);

  function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="flex-1">
        {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {children}
      </Button>
    );
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/timesheets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle>{entry ? 'Edit Timesheet' : 'Log Hours'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {entry && <input type="hidden" name="id" value={entry.id} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project *</Label>
              <Select
                name="projectId"
                defaultValue={entry?.projectId || defaultProjectId || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">Employee *</Label>
              <Select
                name="userId"
                defaultValue={entry?.userId || currentDbUser?.id || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={
                entry?.date
                  ? entry.date.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Regular Hours *</Label>
              <Input
                id="hoursWorked"
                name="hoursWorked"
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="8.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime">Overtime Hours</Label>
              <Input
                id="overtime"
                name="overtime"
                type="number"
                step="0.25"
                min="0"
                max="12"
                value={overtime}
                onChange={(e) => setOvertime(e.target.value)}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label>Total Hours</Label>
              <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{totalHours}h</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={entry?.description || ''}
              placeholder="Describe the work performed..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <SubmitButton>
              {entry ? 'Update Timesheet' : 'Log Hours'}
            </SubmitButton>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/timesheets">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
