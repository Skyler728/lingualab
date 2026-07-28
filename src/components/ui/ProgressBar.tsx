import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max = 100, className, showLabel, size = 'md' }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', sizes[size])}>
        <div
          className={cn('h-full rounded-full bg-indigo-600 transition-all duration-300', sizes[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
