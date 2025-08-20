'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createContact } from '@/lib/actions/contacts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const types = ['CLIENT','CONTRACTOR','VENDOR','INSPECTOR','BURRITO_TRUCK','OTHER'] as const

export function ContactForm() {
  const [state, action] = useActionState(createContact, undefined)
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>New Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div>
            <Select name="type" defaultValue="OTHER">
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input name="name" placeholder="Name" required />
          <Input name="phone" placeholder="Phone" />
          <Input type="email" name="email" placeholder="Email" />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Contact'}
    </Button>
  )
}
