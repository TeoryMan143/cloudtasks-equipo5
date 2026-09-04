import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateTask } from '../types';
import { supabase } from './supabase';

export default function useTasks() {
  const useAllTasks = () =>
    useQuery({
      queryKey: ['all-tasks'],
      queryFn: async () => {
        const { data, error } = await supabase.from('tasks').select('*');

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
