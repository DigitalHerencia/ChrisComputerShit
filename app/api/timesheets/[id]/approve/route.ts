import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPERVISOR")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const timeEntry = await prisma.timeEntry.update({
      where: { id: params.id },
      data: {
        approved: true,
        approvedById: dbUser.id,
      },
      include: {
        project: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error("Error approving timesheet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
