import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { editTaskSchema } from '../schemas';
import type { Task, UserRole } from '../types';
import useTasks from '../utils/use-tasks';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type ViewMode = 'day' | 'week' | 'month';
type EditTaskForm = z.input<typeof editTaskSchema>;
type EditTaskPayload = z.output<typeof editTaskSchema>;

const inputClassName =
  'w-full rounded-lg border border-[#dedeee] bg-white px-3 py-2.5 text-sm text-[#36364f] outline-none transition focus:border-[#5050E0] focus:ring-2 focus:ring-[#5050E0]/15';
const labelClassName =
  'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#77778b]';

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function EditTaskDialog({
  task,
  view,
  role,
  onOpenChange,
}: {
  task: Task | null;
  view: ViewMode;
  role: UserRole;
  onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(task !== null);
  const { useEditTask } = useTasks(role);
  const editTask = useEditTask();
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskForm, unknown, EditTaskPayload>({
    resolver: zodResolver(editTaskSchema),
  });

  useEffect(() => {
    setOpen(task !== null);
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
      });
    }
  }, [task, reset]);

  const close = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange(nextOpen);
  };

  const onSubmit: SubmitHandler<EditTaskPayload> = values => {
    if (!task) return;
    editTask.mutate(
      { id: task.id, task: values },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['all-tasks', view],
          });
          close(false);
          toast.success('Task updated successfully');
        },
        onError: error =>
          toast.error(error.message || 'Could not update the task'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='max-w-lg border border-[#e2e2ef] bg-white p-0'>
        <DialogHeader className='border-b border-[#e8e8f2] px-6 py-5'>
          <DialogTitle className='text-xl font-semibold text-[#252541]'>
            Edit task
          </DialogTitle>
          <DialogDescription className='mt-2 text-sm leading-5 text-[#77778b]'>
            Update the task details on your schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4 px-6 py-5'>
            <div>
              <label htmlFor='edit-task-title' className={labelClassName}>
                Title
              </label>
              <input
                id='edit-task-title'
                type='text'
                className={inputClassName}
                {...register('title')}
              />
              {errors.title && (
                <p className='mt-1 text-xs text-[#b33f4c]'>
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor='edit-task-description' className={labelClassName}>
                Description
              </label>
              <textarea
                id='edit-task-description'
                rows={3}
                className={`${inputClassName} resize-none`}
                {...register('description')}
              />
              {errors.description && (
                <p className='mt-1 text-xs text-[#b33f4c]'>
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <label htmlFor='edit-task-deadline' className={labelClassName}>
                  Deadline
                </label>
                <Controller
                  name='deadline'
                  control={control}
                  render={({ field }) => (
                    <input
                      id='edit-task-deadline'
                      type='datetime-local'
                      className={inputClassName}
                      value={toLocalInputValue(field.value)}
                      onChange={event =>
                        field.onChange(new Date(event.target.value))
                      }
                    />
                  )}
                />
                {errors.deadline && (
                  <p className='mt-1 text-xs text-[#b33f4c]'>
                    {errors.deadline.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor='edit-task-priority' className={labelClassName}>
                  Priority
                </label>
                <select
                  id='edit-task-priority'
                  className={inputClassName}
                  {...register('priority')}
                >
                  <option value='low'>Low</option>
                  <option value='mid'>Mid</option>
                  <option value='high'>High</option>
                </select>
                {errors.priority && (
                  <p className='mt-1 text-xs text-[#b33f4c]'>
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className='mx-0 mb-0 gap-3 px-6 py-4 sm:flex-row sm:justify-end'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='ghost'
                  disabled={editTask.isPending}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type='submit'
              disabled={editTask.isPending}
              className='bg-[#5050E0] text-white hover:bg-[#5050E0]/90'
            >
              {editTask.isPending && (
                <LoaderCircle className='size-4 animate-spin' />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
