import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Add a title'),
  description: z.string().min(2, 'Add a description'),
  deadline: z.date().refine((date) => date > new Date(), {
    message: 'Deadline must be in the future',
  }),
  priority: z.enum(['low', 'mid', 'high']),
});
