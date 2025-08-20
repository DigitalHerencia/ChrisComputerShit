'use server'

import { z } from 'zod'
import { prisma } from '../db'
import { revalidatePath } from 'next/cache'

export const contactSchema = z.object({
  type: z.enum(['CLIENT','CONTRACTOR','VENDOR','INSPECTOR','BURRITO_TRUCK','OTHER']),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export async function createContact(_: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }
  const { type, name, phone, email } = parsed.data
  await prisma.entity.create({
    data: { type, name, phone, email },
  })
  revalidatePath('/dashboard/contacts')
  return { success: true }
}
