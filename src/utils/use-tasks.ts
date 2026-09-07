import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateTask, DBTask, Priority, Task } from '../types';
import { supabase } from './supabase';

const dbTaskToEntity = (dbt: DBTask): Task => ({
  ...dbt,
  deadline: new Date(dbt.deadline),
  created_at: new Date(dbt.created_at),
  priority: dbt.priority as Priority,
});

export default function useTasks() {
  const useAllTasks = (range?: 'day' | 'week' | 'month') =>
    useQuery<Task[]>({
      queryKey: ['all-tasks', range],
      queryFn: async () => {
        const now = new Date();

        if (!range) {
          const { data, error } = await supabase.from('tasks').select();

          if (error) throw new Error(error.message);

          return data.map(dbTaskToEntity);
        }

        const start = new Date(now);
        const end = new Date(now);

        if (range === 'day') {
          start.setHours(0, 0, 0, 0);

          end.setDate(end.getDate() + 1);
          end.setHours(0, 0, 0, 0);
        }

        if (range === 'week') {
          const daysSinceMonday = (now.getDay() + 6) % 7;

          start.setDate(start.getDate() - daysSinceMonday);
          start.setHours(0, 0, 0, 0);

          end.setTime(start.getTime());
          end.setDate(end.getDate() + 7);
        }

        if (range === 'month') {
          start.setDate(1);
          start.setHours(0, 0, 0, 0);

          end.setMonth(end.getMonth() + 1);
          end.setDate(1);
          end.setHours(0, 0, 0, 0);
        }

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .gte('deadline', start.toISOString())
          .lt('deadline', end.toISOString());

        if (error) {
          throw new Error(error.message);
        }

        return data.map(dbTaskToEntity);
      },
    });

  const useGetTask = (id: string) =>
    useQuery({
      queryKey: ['task', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        if (data.length === 0) {
          throw new Error('Task not found');
        }

        return dbTaskToEntity(data[0]);
      },
    });

  const useCreateTask = () =>
    useMutation({
      mutationKey: ['cr-task'],
      mutationFn: async (task: CreateTask) => {
        const { error } = await supabase.from('tasks').insert(task);

        if (error) {
          throw new Error(error.message);
        }

        return true;
      },
    });

  const useCompleteTask = () =>
    useMutation({
      mutationKey: ['com-task'],
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: true })
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        return true;
      },
    });

  const useEditTask = () =>
    useMutation({
      mutationKey: ['edit-task'],
      mutationFn: async ({ id, task }: { id: string; task: CreateTask }) => {
        const { error } = await supabase
          .from('tasks')
          .update(task)
          .eq('id', id);

        if (error) {
          throw new Error(error.message);
        }

        return true;
      },
    });

  return {
    useAllTasks,
    useGetTask,
    useCreateTask,
    useCompleteTask,
    useEditTask,
  };
}
