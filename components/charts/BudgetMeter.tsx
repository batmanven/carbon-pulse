import { ProgressBar } from "@/components/ui/ProgressBar";

interface BudgetMeterProps {
  budgetUsed: number;
  dailyFootprint: number;
  dailyBudget: number;
  insight?: string | null;
}

export function BudgetMeter({
  budgetUsed,
  dailyFootprint,
  dailyBudget,
  insight,
}: BudgetMeterProps) {
  const fallbackMessage =
    budgetUsed === 0
      ? "Log an activity to get started."
      : "You're on track! Keep up the good work.";

  const fillClassName =
    budgetUsed > 90
      ? "bg-brand-pink transition-all duration-1000"
      : "bg-brand-teal transition-all duration-1000";

  return (
    <div className="relative pt-4">
      <div className="flex justify-between text-[14px] font-bold text-ink mb-2">
        <span>{dailyFootprint.toFixed(1)} kg used</span>
        <span>{dailyBudget} kg budget</span>
      </div>
      <ProgressBar
        value={budgetUsed}
        trackClassName="bg-surface-strong w-full"
        fillClassName={fillClassName}
        heightClassName="h-4"
      />
      <p className="text-muted text-[14px] font-medium mt-4 leading-relaxed">
        {insight || fallbackMessage}
      </p>
    </div>
  );
}
