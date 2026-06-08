import { startOfDay, subDays, format } from "date-fns";
import type { Activity } from "@/lib/types";

export function computeWeeklyTrend(activities: Activity[]) {
  const today = startOfDay(new Date());
  const buckets: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(today, i);
    const key = format(d, "EEE");
    buckets[key] = 0;
  }
  for (const act of activities) {
    const day = startOfDay(new Date(act.timestamp));
    const key = format(day, "EEE");
    if (key in buckets) {
      buckets[key] += act.co2e;
    }
  }
  return Object.entries(buckets).map(([date, value]) => ({ date, value }));
}

export function computeDailyFootprint(activities: Activity[]) {
  const today = startOfDay(new Date());
  return activities
    .filter(
      (a) => startOfDay(new Date(a.timestamp)).getTime() === today.getTime(),
    )
    .reduce((sum, a) => sum + a.co2e, 0);
}
