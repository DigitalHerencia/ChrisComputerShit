import { z } from 'zod'

export const timeEntrySchema = z.object({
  id: z.string().cuid().optional(),
  projectId: z.string().cuid(),
  userId: z.string().cuid(),
  date: z.string().min(1),
  hoursWorked: z.coerce.number().min(0),
  overtime: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
})
