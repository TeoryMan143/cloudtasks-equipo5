import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email').min(1, 'Enter your email'),
  password: z.string().min(1, 'Enter your password'),
});

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Add a title'),
  description: z.string().min(2, 'Add a description'),
  deadline: z
    .date()
    .refine(date => date > new Date(), {
      message: 'Deadline must be in the future',
    })
    .transform(d => d.toISOString()),
  priority: z.enum(['low', 'mid', 'high']),
});

export const editTaskSchema = z.object({
  title: z.string().min(2, 'Add a title'),
  description: z.string().min(2, 'Add a description'),
  deadline: z
    .date()
    .refine(date => date > new Date(), {
      message: 'Deadline must be in the future',
    })
    .transform(d => d.toISOString()),
  priority: z.enum(['low', 'mid', 'high']),
});
