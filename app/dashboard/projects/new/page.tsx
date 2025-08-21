import { currentUser } from "@clerk/nextjs/server"
import { ProjectForm } from "@/components/projects/project-form"
import { getClients } from "@/lib/fetchers/contacts"

export default async function NewProjectPage() {
  const user = await currentUser()
  if (!user) return null

  const clients = (await getClients()).map(({ id, name }) => ({ id, name }))

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
