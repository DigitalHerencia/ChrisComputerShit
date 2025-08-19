"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"

interface ApprovalButtonProps {
  entryId: string
}

export function ApprovalButton({ entryId }: ApprovalButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/timesheets/${entryId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve timesheet")
      }

      toast({
        title: "Timesheet approved",
        description: "The timesheet entry has been approved successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve timesheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleApprove} disabled={isLoading}>
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      <CheckCircle className="h-4 w-4 mr-2" />
      Approve Entry
    </Button>
  )
}
