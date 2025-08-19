"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

interface TimesheetFormProps {
  projects: { id: string; name: string }[]
  users: { id: string; firstName: string | null; lastName: string | null; clerkId: string }[]
  defaultProjectId?: string
  entry?: {
    id: string
    projectId: string
    userId: string
    date: Date
    hoursWorked: number
    overtime: number
    description?: string | null
  }
}

export function TimesheetForm({ projects, users, defaultProjectId, entry }: TimesheetFormProps) {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Find current user in the users list
  const currentDbUser = users.find((u) => u.clerkId === user?.id)

  const [formData, setFormData] = useState({
    projectId: entry?.projectId || defaultProjectId || "",
    userId: entry?.userId || currentDbUser?.id || "",
    date: entry?.date ? entry.date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    hoursWorked: entry?.hoursWorked?.toString() || "",
    overtime: entry?.overtime?.toString() || "0",
    description: entry?.description || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const url = entry ? `/api/timesheets/${entry.id}` : "/api/timesheets"
      const method = entry ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date),
          hoursWorked: Number.parseFloat(formData.hoursWorked),
          overtime: Number.parseFloat(formData.overtime || "0"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save timesheet")
      }

      const savedEntry = await response.json()

      toast({
        title: entry ? "Timesheet updated" : "Hours logged",
        description: `${formData.hoursWorked} hours have been ${entry ? "updated" : "logged"} successfully.`,
      })

      router.push(`/dashboard/timesheets/${savedEntry.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save timesheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalHours = (
    Number.parseFloat(formData.hoursWorked || "0") + Number.parseFloat(formData.overtime || "0")
  ).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/timesheets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle>{entry ? "Edit Timesheet" : "Log Hours"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
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
              <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
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
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Regular Hours *</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                placeholder="8.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime">Overtime Hours</Label>
              <Input
                id="overtime"
                type="number"
                step="0.25"
                min="0"
                max="12"
                value={formData.overtime}
                onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the work performed..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {entry ? "Update Entry" : "Log Hours"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/timesheets">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
