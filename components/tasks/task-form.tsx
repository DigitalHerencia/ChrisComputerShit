'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createTask } from '@/lib/actions/tasks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskFormProps {
  projectId?: string
  projects: { id: string; name: string }[]
}

export function TaskForm({ projectId, projects }: TaskFormProps) {
  const [state, action] = useActionState(createTask, undefined)
  return (
    <form action={action} className="space-y-4">
      <select
        name="projectId"
        defaultValue={projectId}
        className="w-full rounded-md border border-gray-200 bg-black p-2 text-foreground"
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
      <Input name="title" placeholder="Task title" required />
      <Input type="date" name="dueDate" />
      <SubmitButton />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Add Task'}
    </Button>
  )
}
