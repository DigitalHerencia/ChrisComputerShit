import { z } from 'zod'

export const contactSchema = z.object({
  type: z.enum([
    'CLIENT',
    'CONTRACTOR',
    'VENDOR',
    'INSPECTOR',
    'EMPLOYEE',
    'BURRITO_TRUCK',
    'OTHER',
  ]),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

