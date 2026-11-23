import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getBloomColor(level: string): { bg: string; text: string; headerBg: string; border: string } {
  switch (level.toLowerCase()) {
    case 'remember':
      return { bg: 'bg-[#70D6FF]', text: 'text-black', headerBg: 'bg-[#70D6FF]', border: 'border-black' };
    case 'understand':
      return { bg: 'bg-[#C4B5FD]', text: 'text-black', headerBg: 'bg-[#C4B5FD]', border: 'border-black' };
    case 'apply':
      return { bg: 'bg-[#CCFF00]', text: 'text-black', headerBg: 'bg-[#CCFF00]', border: 'border-black' };
    case 'analyze':
      return { bg: 'bg-[#FFDE59]', text: 'text-black', headerBg: 'bg-[#FFDE59]', border: 'border-black' };
    case 'evaluate':
      return { bg: 'bg-[#FF8A50]', text: 'text-black', headerBg: 'bg-[#FF8A50]', border: 'border-black' };
    case 'create':
      return { bg: 'bg-[#FF90E8]', text: 'text-black', headerBg: 'bg-[#FF90E8]', border: 'border-black' };
    default:
      return { bg: 'bg-white', text: 'text-black', headerBg: 'bg-slate-200', border: 'border-black' };
  }
}
