import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { TimesheetForm } from "@/components/timesheets/timesheet-form"

export default async function NewTimesheetPage({
  searchParams,
}: {
  searchParams: { project?: string }
}) {
  const user = await currentUser()
  if (!user) return null

  // Get active projects and users for the form
  const [projects, users] = await Promise.all([
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Log Hours</h1>
        <p className="text-muted-foreground">Record time worked on projects</p>
      </div>

      <TimesheetForm projects={projects} users={users} defaultProjectId={searchParams.project} />
    </div>
  )
}
