import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DocumentForm } from "@/components/documents/document-form"

export default async function EditDocumentPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await currentUser()
  if (!user) return null

  const [document, projects] = await Promise.all([
    prisma.document.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        projectId: true,
      },
    }),
    prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!document) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/documents/${document.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Document</h1>
          <p className="text-muted-foreground">Update document information</p>
        </div>
      </div>

      {/* Form */}
      <DocumentForm projects={projects} document={document} />
    </div>
  )
}
