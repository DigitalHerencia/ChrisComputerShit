import { z } from 'zod';

export const logSchema = z.object({
  projectId: z.string().cuid(),
  date: z.string().min(1),
  weather: z.string().optional(),
  crewCount: z.coerce.number().int().optional(),
  workDone: z.string().min(1),
  notes: z.string().optional(),
});
