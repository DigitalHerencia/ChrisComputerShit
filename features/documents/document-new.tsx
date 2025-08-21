import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { DocumentForm } from "@/components/documents/document-form"

export async function DocumentNew() {
  const user = await currentUser()
  if (!user) return null

  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Document</h1>
        <p className="text-muted-foreground">Add a new document to your projects</p>
      </div>
      <DocumentForm projects={projects} />
    </>
  )
}
