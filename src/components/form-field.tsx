import type { LucideIcon } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: LucideIcon;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ error, id, className, icon: Icon, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1'>
        <div className='relative'>
          {Icon && (
            <Icon className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a1a1b5]' />
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full rounded-lg border border-[#e2e2ef] bg-white py-2 text-sm text-[#26263c] outline-none transition-colors focus:border-[#5050E0] focus:ring-2 focus:ring-[#5050E0]/20 ${Icon ? 'pl-9 pr-3' : 'px-3'} ${className ?? ''}`}
            {...props}
          />
        </div>
        {error && <span className='text-xs text-red-500'>{error}</span>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
