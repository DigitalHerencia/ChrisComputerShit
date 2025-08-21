import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clientId: z.string().optional(),
});
