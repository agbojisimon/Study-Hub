interface StatisticsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}

const accentStyles = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  error: 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400',
};

export function StatisticsCard({ label, value, icon, accent = 'primary' }: StatisticsCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
