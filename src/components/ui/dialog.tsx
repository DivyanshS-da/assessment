import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  windowTitle?: string;
  headerColor?: 'lime' | 'yellow' | 'pink' | 'lavender' | 'cyan';
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, windowTitle = 'dialog.box', headerColor = 'yellow', children }: DialogProps) {
  if (!open) return null;

  const headerColors = {
    lime: 'bg-[#CCFF00]',
    yellow: 'bg-[#FFDE59]',
    pink: 'bg-[#FF90E8]',
    lavender: 'bg-[#C4B5FD]',
    cyan: 'bg-[#70D6FF]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Neo-brutalist Dialog content */}
      <div className="relative z-50 w-full max-w-xl border-3 border-black bg-white shadow-neo-xl overflow-hidden">
        {/* Title bar */}
        <div className={cn('px-4 py-2 border-b-2 border-black flex items-center justify-between', headerColors[headerColor])}>
          <span className="font-mono text-xs font-black uppercase tracking-tight text-black">ooo {windowTitle}</span>
          <button
            onClick={() => onOpenChange(false)}
            className="border-2 border-black bg-white hover:bg-black hover:text-white p-0.5 transition-colors shadow-neo-sm active:translate-x-[1px] active:translate-y-[1px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 mb-5', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-xl font-black text-black tracking-tight uppercase', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs font-semibold text-slate-700', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 pt-4 border-t-2 border-black flex items-center justify-end gap-3', className)} {...props} />;
}
