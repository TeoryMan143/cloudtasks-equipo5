import { CalendarDays, Check, ChevronRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { TaskCard } from './components/task-card';
import { Button } from './components/ui/button';
import type { Task } from './types';
import useTasks from './utils/use-tasks';

type ViewMode = 'day' | 'week' | 'month';
const viewLabels: Record<ViewMode, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatPeriod(date: Date, view: ViewMode) {
  if (view === 'day')
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  if (view === 'week') {
    const start = startOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

function tasksForDate(tasks: Task[], date: Date) {
  return tasks.filter(task => dateKey(task.deadline) === dateKey(date));
}

function DayCell({
  date,
  tasks,
  isCurrentMonth = true,
}: {
  date: Date;
  tasks: Task[];
  isCurrentMonth?: boolean;
}) {
  const isToday = dateKey(date) === dateKey(new Date());
  return (
    <div
      className={`min-h-32 border-b border-r border-[#e8e8f2] bg-white p-2 ${!isCurrentMonth ? 'bg-[#fafaff] text-[#b4b4c4]' : ''}`}
    >
      <div className='mb-2 flex items-center justify-between'>
        <span
          className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-[#5050E0] text-white' : 'text-[#66667b]'}`}
        >
          {date.getDate()}
        </span>
        {tasks.length > 0 && (
          <span className='text-[10px] font-medium text-[#9999aa]'>
            {tasks.length}
          </span>
        )}
      </div>
      <div className='space-y-1'>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} compact />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<ViewMode>('month');
  const { useAllTasks } = useTasks();
  const { data: tasks = [], isLoading, isError } = useAllTasks(view);
  const today = new Date();
  const todayTasks = tasksForDate(tasks, today);
  const weekStart = startOfWeek(today);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const calendarStart = startOfWeek(monthStart);
  const monthDates = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(date.getDate() + index);
    return date;
  });

  return (
    <main className='min-h-screen bg-[#F8F8F8] text-[#26263c]'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-12'>
        <header className='mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#865cf0]'>
              <CalendarDays className='size-4' />
              Cloudtasks
            </div>
            <h1 className='text-3xl font-semibold tracking-tight text-[#252541] sm:text-4xl'>
              Your schedule
            </h1>
            <p className='mt-2 text-sm text-[#77778b]'>
              Keep a clear view of what needs your attention.
            </p>
          </div>
          <fieldset
            className='flex rounded-xl border border-[#e2e2ef] bg-white p-1 shadow-sm'
            aria-label='Calendar view'
          >
            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
              <Button
                key={mode}
                type='button'
                variant='ghost'
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`h-9 rounded-lg px-4 text-xs ${view === mode ? 'bg-[#5050E0] text-white hover:bg-[#5050E0]/90 hover:text-white' : 'text-[#77778b]'}`}
              >
                {viewLabels[mode]}
              </Button>
            ))}
          </fieldset>
        </header>
        <section className='overflow-hidden rounded-2xl border border-[#e2e2ef] bg-white shadow-[0_18px_50px_rgba(80,80,224,0.08)]'>
          <div className='flex items-center justify-between border-b border-[#e8e8f2] px-5 py-4 sm:px-6'>
            <div>
              <h2 className='text-lg font-semibold text-[#252541]'>
                {formatPeriod(today, view)}
              </h2>
              <p className='mt-0.5 text-xs text-[#9999aa]'>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this
                view
              </p>
            </div>
            <div className='hidden items-center gap-2 text-xs font-medium text-[#77778b] sm:flex'>
              <span className='size-2 rounded-full bg-[#5050E0]' />
              Today
              <ChevronRight className='size-4 text-[#c2c2cf]' />
              <span className='size-2 rounded-full bg-[#865cf0]' />
              Priority
            </div>
          </div>
          {isLoading ? (
            <div className='flex min-h-80 items-center justify-center gap-2 text-sm text-[#77778b]'>
              <LoaderCircle className='size-4 animate-spin' />
              Loading tasks...
            </div>
          ) : isError ? (
            <div className='flex min-h-80 items-center justify-center px-6 text-center text-sm text-[#b34b5a]'>
              We couldn&apos;t load your tasks right now.
            </div>
          ) : view === 'day' ? (
            <div className='p-4 sm:p-6'>
              {todayTasks.length > 0 ? (
                <div className='max-w-xl space-y-2'>
                  {todayTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <EmptyState label='No tasks due today' />
              )}
            </div>
          ) : view === 'week' ? (
            <div className='grid grid-cols-1 divide-y divide-[#e8e8f2] md:grid-cols-7 md:divide-x md:divide-y-0'>
              {weekDates.map((date, index) => (
                <div key={dateKey(date)} className='min-h-56 bg-white p-3'>
                  <div className='mb-4 flex items-center justify-between'>
                    <span className='text-[11px] font-bold uppercase tracking-wider text-[#9999aa]'>
                      {weekDays[index]}
                    </span>
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${dateKey(date) === dateKey(today) ? 'bg-[#5050E0] text-white' : 'text-[#66667b]'}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div className='space-y-1'>
                    {tasksForDate(tasks, date).map(task => (
                      <TaskCard key={task.id} task={task} compact />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <div className='min-w-180'>
                <div className='grid grid-cols-7 border-b border-[#e8e8f2] bg-[#fafaff]'>
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className='px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9999aa]'
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className='grid grid-cols-7'>
                  {monthDates.map(date => (
                    <DayCell
                      key={dateKey(date)}
                      date={date}
                      tasks={tasksForDate(tasks, date)}
                      isCurrentMonth={date.getMonth() === today.getMonth()}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
        <footer className='mt-5 flex items-center gap-2 text-xs text-[#9999aa]'>
          <Check className='size-3.5 text-[#5050E0]' />
          Completed tasks stay visible so your progress is easy to scan.
        </footer>
      </div>
    </main>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className='flex min-h-64 flex-col items-center justify-center text-center'>
      <div className='mb-3 flex size-11 items-center justify-center rounded-full bg-[#5050E0]/10 text-[#5050E0]'>
        <CalendarDays className='size-5' />
      </div>
      <p className='text-sm font-semibold text-[#55556d]'>{label}</p>
      <p className='mt-1 text-xs text-[#9999aa]'>A quiet stretch. Enjoy it.</p>
    </div>
  );
}

export default App;
