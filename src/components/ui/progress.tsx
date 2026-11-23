import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  color?: 'lime' | 'yellow' | 'pink' | 'lavender' | 'cyan';
}

export function Progress({ value, max = 100, className, color = 'lime' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const fillColors = {
    lime: 'bg-[#CCFF00]',
    yellow: 'bg-[#FFDE59]',
    pink: 'bg-[#FF90E8]',
    lavender: 'bg-[#C4B5FD]',
    cyan: 'bg-[#70D6FF]',
  };

  return (
    <div className={cn('relative h-4 w-full border-2 border-black bg-white shadow-neo-sm overflow-hidden', className)}>
      <div
        className={cn('h-full border-r-2 border-black transition-all duration-300', fillColors[color])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
