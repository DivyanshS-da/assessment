import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onChange?: (val: string) => void }>, {
            activeValue: value,
            onChange: onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className, activeValue, onChange }: { 
  children: React.ReactNode; 
  className?: string; 
  activeValue?: string; 
  onChange?: (val: string) => void 
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 p-1.5 border-2 border-black bg-[#F8F7FF] shadow-neo-sm', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onChange?: (val: string) => void }>, {
            activeValue,
            onChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  activeValue,
  onChange,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
  onChange?: (val: string) => void;
}) {
  const isActive = activeValue === value;
  return (
    <button
      type="button"
      onClick={() => onChange?.(value)}
      className={cn(
        'inline-flex items-center justify-center font-black uppercase text-xs px-4 py-2 border-2 border-black transition-all select-none',
        isActive
          ? 'bg-[#CCFF00] text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
          : 'bg-white text-black hover:bg-[#FFDE59] shadow-none',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
  activeValue,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
}) {
  if (activeValue !== value) return null;
  return <div className={cn('mt-4', className)}>{children}</div>;
}
