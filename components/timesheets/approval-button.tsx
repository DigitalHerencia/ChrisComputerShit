'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { approveTimesheet } from '@/lib/actions/timesheets';
import { useFormStatus } from 'react-dom';

interface ApprovalButtonProps {
  entryId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      <CheckCircle className="h-4 w-4 mr-2" />
      Approve Entry
    </Button>
  );
}

export function ApprovalButton({ entryId }: ApprovalButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [state, formAction] = useActionState(approveTimesheet, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    } else if (state.success) {
      toast({
        title: 'Timesheet approved',
        description: 'The timesheet entry has been approved successfully.',
      });
      router.refresh();
    }
  }, [state, toast, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={entryId} />
      <SubmitButton />
    </form>
  );
}
