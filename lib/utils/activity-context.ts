import type { Activity } from "@/lib/types";

export function formatActivitySummaryLine(activity: Activity): string {
  return `${activity.amount}${activity.unit} of ${activity.subCategory} (${activity.co2e}kg CO2)`;
}

export function formatActivityDetailLine(activity: Activity): string {
  return `${activity.amount}${activity.unit} of ${activity.subCategory} (${activity.co2e}kg CO₂ — ${activity.equivalent})`;
}

export function formatRecentActivities(
  activities: Activity[],
  formatter: (activity: Activity) => string,
  limit = 30,
): string {
  const recent = activities.slice(-limit);
  if (recent.length === 0) return "No activities logged yet.";
  return recent.map(formatter).join("\n");
}
