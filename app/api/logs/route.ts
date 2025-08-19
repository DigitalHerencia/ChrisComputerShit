import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName,
          lastName: user.lastName,
        },
      })
    }

    const body = await request.json()
    const { projectId, date, weather, crewCount, workDone, notes } = body

    const dailyLog = await prisma.dailyLog.create({
      data: {
        projectId,
        date: new Date(date),
        weather: weather || null,
        crewCount: crewCount || null,
        workDone,
        notes: notes || null,
        createdById: dbUser.id,
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
        photos: true,
      },
    })

    return NextResponse.json(dailyLog)
  } catch (error) {
    console.error("Error creating daily log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
