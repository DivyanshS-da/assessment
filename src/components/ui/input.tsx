import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-black pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full border-2 border-black bg-white px-3.5 py-2 text-sm font-semibold text-black placeholder:text-slate-500 shadow-neo-sm',
            'transition-all duration-150 focus:outline-none focus:shadow-neo focus:bg-[#FFFDF5]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
