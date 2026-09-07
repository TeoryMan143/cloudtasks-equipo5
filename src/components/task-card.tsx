import { Check, Clock3 } from 'lucide-react';
import type { Task } from '../types';

const priorityStyles = {
  low: 'border-l-[#865cf0] bg-[#865cf0]/8',
  mid: 'border-l-[#5050E0] bg-[#5050E0]/8',
  high: 'border-l-[#e35d6a] bg-[#e35d6a]/10',
} as const;

type TaskCardProps = { task: Task; compact?: boolean };

export function TaskCard({ task, compact = false }: TaskCardProps) {
  return (
    <article
      className={`border-l-[3px] px-2.5 py-2 transition-colors hover:bg-white ${priorityStyles[task.priority]} ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className='flex items-start gap-2'>
        <span
          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${task.completed ? 'border-[#5050E0] bg-[#5050E0] text-white' : 'border-[#5050E0]/35 text-transparent'}`}
          title={task.completed ? 'Completed' : 'Not completed'}
        >
          <Check className='size-2.5' strokeWidth={3} />
        </span>
        <div className='min-w-0'>
          <p
            className={`truncate text-xs font-semibold text-[#26263c] ${task.completed ? 'line-through' : ''}`}
          >
            {task.title}
          </p>
          {!compact && task.description && (
            <p className='mt-1 line-clamp-2 text-[11px] leading-4 text-[#77778b]'>
              {task.description}
            </p>
          )}
          {!compact && (
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#77778b]'>
              <Clock3 className='size-3' />
              {task.deadline.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
