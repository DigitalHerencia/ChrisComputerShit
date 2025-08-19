import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, userId, date, hoursWorked, overtime, description } = body

    const timeEntry = await prisma.timeEntry.create({
      data: {
        projectId,
        userId,
        date: new Date(date),
        hoursWorked,
        overtime: overtime || 0,
        description: description || null,
        approved: false, // Requires approval by default
      },
      include: {
        project: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error("Error creating timesheet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
