'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createDailyLog } from '@/lib/actions/logs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LogFormProps {
  projects: { id: string; name: string }[]
}

export function LogForm({ projects }: LogFormProps) {
  const [state, action] = useActionState(createDailyLog, undefined)
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectId">Project</Label>
        <select
          id="projectId"
          name="projectId"
          className="w-full rounded-md border border-gray-200 bg-black p-2 text-foreground"
          defaultValue=""
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
          <Input id="date" type="date" name="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weather">Weather</Label>
          <Input id="weather" name="weather" placeholder="e.g. Sunny" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crewCount">Crew Count</Label>
          <Input id="crewCount" name="crewCount" type="number" min="0" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workDone">Work Performed</Label>
        <Textarea id="workDone" name="workDone" required rows={4} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="photos">Photos</Label>
        <Input id="photos" name="photos" type="file" accept="image/*" multiple />
      </div>
      <SubmitButton />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Log'}
    </Button>
  )
}
