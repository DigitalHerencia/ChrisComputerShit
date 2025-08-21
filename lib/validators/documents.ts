import { z } from 'zod';

export const documentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  projectId: z.string().optional(),
});
