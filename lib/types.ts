import type { z } from "zod";
import type { activityCategorySchema, activitySchema } from "@/lib/schemas/activity";
import type { challengeSchema } from "@/lib/schemas/challenge";
import type { recommendationSchema } from "@/lib/schemas/recommend";

export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type Challenge = z.infer<typeof challengeSchema>;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
