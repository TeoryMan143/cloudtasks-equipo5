import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarPlus, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { createTaskSchema } from '../schemas';
import type { UserRole } from '../types';
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
  DialogTrigger,
} from './ui/dialog';

type ViewMode = 'day' | 'week' | 'month';
type CreateTaskForm = z.input<typeof createTaskSchema>;
type CreateTaskPayload = z.output<typeof createTaskSchema>;

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const inputClassName =
  'w-full rounded-lg border border-[#dedeee] bg-white px-3 py-2.5 text-sm text-[#36364f] outline-none transition focus:border-[#5050E0] focus:ring-2 focus:ring-[#5050E0]/15';
const labelClassName =
  'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#77778b]';

export function CreateTaskDialog({
  view,
  role,
}: {
  view: ViewMode;
  role: UserRole;
}) {
  const [open, setOpen] = useState(false);
  const { useCreateTask } = useTasks(role);
  const createTask = useCreateTask();
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskForm, unknown, CreateTaskPayload>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: new Date(Date.now() + 60 * 60 * 1000),
      priority: 'mid',
    },
  });

  const onSubmit: SubmitHandler<CreateTaskPayload> = task => {
    createTask.mutate(task, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['all-tasks', view] });
        reset();
        setOpen(false);
        toast.success('Task created successfully');
      },
      onError: error =>
        toast.error(error.message || 'Could not create the task'),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen && !createTask.isPending) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button
            type='button'
            className='h-10 gap-2 bg-[#5050E0] px-4 text-sm text-white shadow-sm hover:bg-[#5050E0]/90'
          />
        }
      >
        <CalendarPlus className='size-4' />
        Add task
      </DialogTrigger>
      <DialogContent className='max-w-lg border border-[#e2e2ef] bg-white p-0'>
        <DialogHeader className='border-b border-[#e8e8f2] px-6 py-5'>
          <DialogTitle className='text-xl font-semibold text-[#252541]'>
            Add a new task
          </DialogTitle>
          <DialogDescription className='mt-2 text-sm leading-5 text-[#77778b]'>
            Create a task and place it on your schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4 px-6 py-5'>
            <div>
              <label htmlFor='task-title' className={labelClassName}>
                Title
              </label>
              <input
                id='task-title'
                type='text'
                placeholder='What needs to be done?'
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
              <label htmlFor='task-description' className={labelClassName}>
                Description
              </label>
              <textarea
                id='task-description'
                rows={3}
                placeholder='Add some context...'
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
                <label htmlFor='task-deadline' className={labelClassName}>
                  Deadline
                </label>
                <Controller
                  name='deadline'
                  control={control}
                  render={({ field }) => (
                    <input
                      id='task-deadline'
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
                <label htmlFor='task-priority' className={labelClassName}>
                  Priority
                </label>
                <select
                  id='task-priority'
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
                  disabled={createTask.isPending}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type='submit'
              disabled={createTask.isPending}
              className='bg-[#5050E0] text-white hover:bg-[#5050E0]/90'
            >
              {createTask.isPending && (
                <LoaderCircle className='size-4 animate-spin' />
              )}
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
