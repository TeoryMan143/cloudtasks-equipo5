import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateTask } from '../types';
import { supabase } from './supabase';

export default function useTasks() {
  const useAllTasks = (range?: 'day' | 'week' | 'month') =>
    useQuery({
      queryKey: ['all-tasks', range],
      queryFn: async () => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        if (range === 'day') {
          start.setHours(0, 0, 0, 0);
          end.setDate(end.getDate() + 1);
          end.setHours(0, 0, 0, 0);
        } else if (range === 'week') {
          const daysSinceMonday = (now.getDay() + 6) % 7;
          start.setDate(start.getDate() - daysSinceMonday);
          start.setHours(0, 0, 0, 0);
          end.setTime(start.getTime());
          end.setDate(end.getDate() + 7);
        } else if (range === 'month') {
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setFullYear(end.getFullYear(), end.getMonth() + 1, 1);
          end.setHours(0, 0, 0, 0);
        }

        let query = supabase.from('tasks').select('*');

        if (range) {
          query = query
            .gte('deadline', start.toISOString())
            .lt('deadline', end.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        return data;
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

        return data;
      },
    });

  const useCreateTask = () =>
    useMutation({
      mutationKey: ['cr-task'],
      mutationFn: async (task: CreateTask) => {
        const { error } = await supabase
          .from('tasks')
          .insert({ ...task, deadline: task.deadline.toISOString() });

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
          .update({ ...task, deadline: task.deadline.toISOString() })
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
