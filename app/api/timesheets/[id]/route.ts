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
    const { projectId, userId, date, hoursWorked, overtime, description } = body

    const timeEntry = await prisma.timeEntry.update({
      where: { id: params.id },
      data: {
        projectId,
        userId,
        date: new Date(date),
        hoursWorked,
        overtime: overtime || 0,
        description: description || null,
      },
      include: {
        project: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error("Error updating timesheet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.timeEntry.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting timesheet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
