import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const logId = formData.get("logId") as string
    const caption = formData.get("caption") as string

    if (!file || !logId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, you would upload the file to a cloud storage service
    // For now, we'll create a placeholder URL
    const photoUrl = `/placeholder.svg?height=400&width=600&query=construction site photo`

    const photo = await prisma.logPhoto.create({
      data: {
        logId,
        url: photoUrl,
        caption: caption || null,
      },
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
