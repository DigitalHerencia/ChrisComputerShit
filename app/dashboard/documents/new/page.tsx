import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DocumentForm } from "@/components/documents/document-form"

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: { project?: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/documents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Document</h1>
          <p className="text-muted-foreground">Add a new document to your project</p>
        </div>
      </div>

      {/* Form */}
      <DocumentForm projects={projects} defaultProjectId={searchParams.project} />
    </div>
  )
}
