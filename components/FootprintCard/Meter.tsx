import { ProgressBar } from "@/components/ui/ProgressBar";

interface MeterProps {
  budgetUsed: number;
}

export function Meter({ budgetUsed }: MeterProps) {
  return (
    <div className="mt-6">
      <ProgressBar
        value={budgetUsed}
        trackClassName="bg-black/20"
        fillClassName="bg-brand-mint transition-all duration-500"
      />
    </div>
  );
}
