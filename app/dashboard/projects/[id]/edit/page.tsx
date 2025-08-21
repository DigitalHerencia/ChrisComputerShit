import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/projects/project-form"
import { getClients } from "@/lib/fetchers/contacts"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const [project, clientEntities] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
    }),
    getClients(),
  ])
  const clients = clientEntities.map(({ id, name }) => ({ id, name }))

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground">Update project information</p>
      </div>

      <ProjectForm clients={clients} project={project} />
    </div>
  )
}
