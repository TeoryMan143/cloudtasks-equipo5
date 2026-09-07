import { Clock3, LoaderCircle, Pencil } from 'lucide-react';
import type { Task } from '@/types';
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

export function TaskDetailsDialog({
  task,
  isPending,
  onOpenChange,
  onToggleCompletion,
  onEdit,
}: {
  task: Task | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleCompletion: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog open={task !== null} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg border border-[#e2e2ef] bg-white p-0'>
        {task && (
          <>
            <DialogHeader className='border-b border-[#e8e8f2] px-6 py-5'>
              <div className='flex items-start justify-between gap-4 pr-6'>
                <div>
                  <DialogTitle className='text-xl font-semibold text-[#252541]'>
                    {task.title}
                  </DialogTitle>
                  <DialogDescription className='mt-2 text-sm leading-5 text-[#77778b]'>
                    Task details and completion status
                  </DialogDescription>
                </div>
                <span
                  className={`mt-1 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${task.completed ? 'bg-[#5050E0]/10 text-[#5050E0]' : 'bg-[#865cf0]/10 text-[#865cf0]'}`}
                >
                  {task.completed ? 'Completed' : 'Open'}
                </span>
              </div>
            </DialogHeader>
            <div className='space-y-5 px-6 py-5'>
              <div>
                <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9999aa]'>
                  Description
                </p>
                <p className='text-sm leading-6 text-[#55556d]'>
                  {task.description || 'No description provided.'}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-[#F8F8F8] p-3'>
                  <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9999aa]'>
                    Deadline
                  </p>
                  <p className='flex items-center gap-1.5 text-sm font-medium text-[#55556d]'>
                    <Clock3 className='size-3.5 text-[#5050E0]' />
                    {task.deadline.toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className='rounded-lg bg-[#F8F8F8] p-3'>
                  <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9999aa]'>
                    Priority
                  </p>
                  <p className='text-sm font-medium capitalize text-[#55556d]'>
                    {task.priority}
                  </p>
                </div>
              </div>
              <div className='rounded-lg border border-[#e8e8f2] px-3 py-2.5'>
                <p className='text-[10px] font-bold uppercase tracking-[0.14em] text-[#9999aa]'>
                  Created
                </p>
                <p className='mt-1 text-sm text-[#77778b]'>
                  {task.created_at.toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
            <DialogFooter className='mx-0 mb-0 gap-3 px-6 py-4 sm:flex-row sm:items-center'>
              <Button
                type='button'
                variant='outline'
                className='sm:mr-auto'
                onClick={onEdit}
              >
                <Pencil className='size-3.5' />
                Edit
              </Button>
              <Button
                type='button'
                onClick={onToggleCompletion}
                disabled={isPending}
                className='bg-[#5050E0] text-white hover:bg-[#5050E0]/90'
              >
                {isPending && <LoaderCircle className='size-4 animate-spin' />}
                {task.completed ? 'Mark as active' : 'Mark as completed'}
              </Button>
              <DialogClose render={<Button type='button' variant='ghost' />}>
                Close
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
