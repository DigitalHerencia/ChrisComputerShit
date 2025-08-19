import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { TimesheetForm } from "@/components/timesheets/timesheet-form"

export default async function EditTimesheetPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const [timeEntry, projects, users] = await Promise.all([
    prisma.timeEntry.findUnique({
      where: { id: params.id },
    }),
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, clerkId: true },
      orderBy: { firstName: "asc" },
    }),
  ])

  if (!timeEntry) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Timesheet</h1>
        <p className="text-muted-foreground">Update time entry information</p>
      </div>

      <TimesheetForm projects={projects} users={users} entry={timeEntry} />
    </div>
  )
}
