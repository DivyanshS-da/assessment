import * as React from 'react';
import { cn, getBloomColor } from '@/lib/utils';
import { BloomLevel } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lime' | 'yellow' | 'pink' | 'lavender' | 'cyan' | 'white' | 'dark' | 'bloom';
  bloomLevel?: BloomLevel;
}

export function Badge({ className, variant = 'white', bloomLevel, children, ...props }: BadgeProps) {
  if (variant === 'bloom' && bloomLevel) {
    const bloom = getBloomColor(bloomLevel);
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000]',
          bloom.bg,
          bloom.text,
          className
        )}
        {...props}
      >
        ✦ {bloomLevel}
      </span>
    );
  }

  const variants = {
    lime: 'bg-[#CCFF00] text-black',
    yellow: 'bg-[#FFDE59] text-black',
    pink: 'bg-[#FF90E8] text-black',
    lavender: 'bg-[#C4B5FD] text-black',
    cyan: 'bg-[#70D6FF] text-black',
    white: 'bg-white text-black',
    dark: 'bg-black text-white',
    bloom: 'bg-white text-black',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
