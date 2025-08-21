'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProjectFormProps {
  clients: { id: string; name: string }[];
  project?: {
    id: string;
    name: string;
    description?: string | null;
    location?: string | null;
    status: string;
    startDate?: Date | null;
    endDate?: Date | null;
    clientId?: string | null;
  };
  action: (state: unknown, formData: FormData) => Promise<any>;
}

export function ProjectForm({ clients, project, action }: ProjectFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    location: project?.location || '',
    status: project?.status || 'PLANNING',
    startDate: project?.startDate
      ? project.startDate.toISOString().split('T')[0]
      : '',
    endDate: project?.endDate
      ? project.endDate.toISOString().split('T')[0]
      : '',
    clientId: project?.clientId || 'defaultClientId',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {project && <input type="hidden" name="id" value={project.id} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Street Pipe Installation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the project..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., 123 Main St, Anthony, NM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              name="clientId"
              value={formData.clientId}
              onValueChange={(value) =>
                setFormData({ ...formData, clientId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defaultClientId">No client selected</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <SubmitButton label={project ? 'Update Project' : 'Create Project'} />
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/projects">Cancel</Link>
            </Button>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      <Save className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
