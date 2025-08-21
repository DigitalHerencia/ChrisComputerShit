'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { join } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { z } from 'zod'
import { prisma } from '../db'

export const logSchema = z.object({
  projectId: z.string().cuid(),
  date: z.string().min(1),
  weather: z.string().optional(),
  crewCount: z.coerce.number().int().optional(),
  workDone: z.string().min(1),
  notes: z.string().optional(),
})

export async function createDailyLog(_: unknown, formData: FormData) {
  const { userId } = auth()
  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const raw = Object.fromEntries(formData)
  const parsed = logSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const { projectId, date, weather, crewCount, workDone, notes } = parsed.data

  const log = await prisma.dailyLog.create({
    data: {
      projectId,
      date: new Date(date),
      weather,
      crewCount,
      workDone,
      notes,
      createdById: userId,
    },
  })

  const files = formData.getAll('photos') as File[]
  if (files.length) {
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      if (!file || !file.name) continue
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${log.id}-${Date.now()}-${file.name}`
      await writeFile(join(uploadDir, filename), buffer)
      await prisma.logPhoto.create({
        data: {
          logId: log.id,
          url: `/uploads/${filename}`,
        },
      })
    }
  }

  revalidatePath('/dashboard/logs')
  return { success: true, id: log.id }
}

