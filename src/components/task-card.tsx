import { Check, Clock3 } from 'lucide-react';
import type { Task } from '../types';

const priorityStyles = {
  low: 'border-l-4 border-l-[#865cf0] bg-[#f1edff]',
  mid: 'border-l-4 border-l-[#5050E0] bg-[#e4e5ff]',
  high: 'border-l-4 border-l-[#e35d6a] bg-[#ffe9eb]',
} as const;

const priorityLabels = {
  low: { short: 'L', full: 'Low', className: 'bg-[#865cf0]/15 text-[#6840c4]' },
  mid: { short: 'M', full: 'Mid', className: 'bg-[#5050E0]/15 text-[#3434ad]' },
  high: {
    short: 'H',
    full: 'High',
    className: 'bg-[#e35d6a]/15 text-[#b33f4c]',
  },
} as const;

type TaskCardProps = { task: Task; compact?: boolean; onClick?: () => void };

export function TaskCard({ task, compact = false, onClick }: TaskCardProps) {
  return (
    <article
      className={`border-l-[3px] px-2.5 py-2 transition-colors hover:bg-white cursor-pointer ${priorityStyles[task.priority]} ${task.completed ? 'opacity-60' : ''}`}
      onClick={onClick}
      onKeyDown={event => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className='flex items-start gap-2'>
        <span
          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${task.completed ? 'border-[#5050E0] bg-[#5050E0] text-white' : 'border-[#5050E0]/35 text-transparent'}`}
          title={task.completed ? 'Completed' : 'Not completed'}
        >
          <Check className='size-2.5' strokeWidth={3} />
        </span>
        <div className='min-w-0'>
          <div className='flex items-center gap-1.5'>
            <p
              className={`min-w-0 flex-1 truncate text-xs font-semibold text-[#26263c] ${task.completed ? 'line-through' : ''}`}
            >
              {task.title}
            </p>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${priorityLabels[task.priority].className}`}
              title={`${priorityLabels[task.priority].full} priority`}
            >
              <span className='sm:hidden'>
                {priorityLabels[task.priority].short}
              </span>
              <span className='hidden sm:inline'>
                {priorityLabels[task.priority].full}
              </span>
            </span>
          </div>
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
