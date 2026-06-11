interface ProgressBarProps {
  value: number;
  trackClassName: string;
  fillClassName: string;
  heightClassName?: string;
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  trackClassName,
  fillClassName,
  heightClassName = "h-3",
  ariaLabel = "Budget usage percentage",
}: ProgressBarProps) {
  return (
    <div className={`${heightClassName} ${trackClassName} rounded-full overflow-hidden`}>
      <div
        className={`h-full ${fillClassName} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(value, 100)}%` }}
        role="meter"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
