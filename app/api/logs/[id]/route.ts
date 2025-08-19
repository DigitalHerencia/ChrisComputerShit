import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, date, weather, crewCount, workDone, notes } = body

    const dailyLog = await prisma.dailyLog.update({
      where: { id: params.id },
      data: {
        projectId,
        date: new Date(date),
        weather: weather || null,
        crewCount: crewCount || null,
        workDone,
        notes: notes || null,
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
        photos: true,
      },
    })

    return NextResponse.json(dailyLog)
  } catch (error) {
    console.error("Error updating daily log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.dailyLog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting daily log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
