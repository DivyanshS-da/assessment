import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  windowTitle?: string;
  headerColor?: 'lime' | 'yellow' | 'pink' | 'lavender' | 'cyan' | 'white' | 'dark';
}

export function Card({ 
  className, 
  windowTitle, 
  headerColor = 'white', 
  children, 
  ...props 
}: CardProps) {
  const headerColors = {
    lime: 'bg-[#CCFF00]',
    yellow: 'bg-[#FFDE59]',
    pink: 'bg-[#FF90E8]',
    lavender: 'bg-[#C4B5FD]',
    cyan: 'bg-[#70D6FF]',
    white: 'bg-white',
    dark: 'bg-black text-white',
  };

  return (
    <div
      className={cn(
        'rounded-none bg-white border-2 border-black shadow-neo overflow-hidden transition-all',
        className
      )}
      {...props}
    >
      {windowTitle && (
        <div className={cn('px-3.5 py-1.5 border-b-2 border-black flex items-center justify-between select-none', headerColors[headerColor])}>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold tracking-tight">ooo {windowTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-white"></span>
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-white"></span>
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-black"></span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pb-3 space-y-1', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-black tracking-tight text-black uppercase', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs font-medium text-slate-700 leading-relaxed', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0 border-t-2 border-black flex items-center bg-slate-50', className)} {...props} />;
}
