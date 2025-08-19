import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { DailyLogForm } from "@/components/logs/daily-log-form"

export default async function NewDailyLogPage({
  searchParams,
}: {
  searchParams: { project?: string }
}) {
  const user = await currentUser()
  if (!user) return null

  // Get active projects for the form
  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Daily Log</h1>
        <p className="text-muted-foreground">Document today's progress and activities</p>
      </div>

      <DailyLogForm projects={projects} defaultProjectId={searchParams.project} />
    </div>
  )
}
