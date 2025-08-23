'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createContact, updateContact } from '@/lib/actions/contacts';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const types = [
  'CLIENT',
  'CONTRACTOR',
  'VENDOR',
  'INSPECTOR',
  'EMPLOYEE',
  'BURRITO_TRUCK',
  'OTHER',
] as const;

interface ContactFormProps {
  id?: string;
  defaultValues?: { type?: string; name?: string; phone?: string; email?: string };
  // when true, the form will use update action
  edit?: boolean;
}

export function ContactForm({ id, defaultValues, edit }: ContactFormProps) {
  const actionFn = edit ? updateContact : createContact;
  const [state, action] = useActionState(actionFn, undefined);
  const router = useRouter();

  useEffect(() => {
    // After successful create, navigate to the contacts list.
    if (!edit && state?.success) {
      router.push('/dashboard/contacts');
    }
  }, [edit, state?.success, router]);
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{edit ? 'Edit Contact' : 'New Contact'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {id && <input type="hidden" name="id" value={id} />}
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
          <Input name="name" placeholder="Name" required defaultValue={defaultValues?.name} />
          <Input name="phone" placeholder="Phone" defaultValue={defaultValues?.phone} />
          <Input type="email" name="email" placeholder="Email" defaultValue={defaultValues?.email} />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Contact'}
    </Button>
  );
}
