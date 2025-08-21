import { z } from 'zod';

export const taskSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(1),
  dueDate: z.string().optional(),
});
