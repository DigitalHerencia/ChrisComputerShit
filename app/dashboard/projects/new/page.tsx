import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { ProjectForm } from "@/components/projects/project-form"

export default async function NewProjectPage() {
  const user = await currentUser()
  if (!user) return null

  // Get clients for the form
  const clients = await prisma.entity.findMany({
    where: { type: "CLIENT" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Project</h1>
        <p className="text-muted-foreground">Create a new construction project</p>
      </div>

      <ProjectForm clients={clients} />
    </div>
  )
}
