import type z from 'zod';
import type { createTaskSchema } from './schemas';

export type Priority = 'low' | 'mid' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  deadline: Date;
  priority: Priority;
};

export type CreateTask = z.infer<typeof createTaskSchema>;

export type DBTask = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  deadline: string;
  priority: string;
};
