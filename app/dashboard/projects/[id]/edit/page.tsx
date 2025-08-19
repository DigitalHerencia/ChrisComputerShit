import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/projects/project-form"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const [project, clients] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
    }),
    prisma.entity.findMany({
      where: { type: "CLIENT" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

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
