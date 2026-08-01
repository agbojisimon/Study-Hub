interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="text-gray-400 dark:text-gray-500 tabular-nums">
            {percentage}%
          </span>
        </div>
      )}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-primary-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
