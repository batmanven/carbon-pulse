import { z } from "zod";

export const parseInputSchema = z.object({
  input: z.string().min(1).max(500),
});

export const activitySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: z.string(),
  subCategory: z.string(),
  amount: z.number(),
  unit: z.string(),
  co2e: z.number(),
  equivalent: z.string(),
  rawInput: z.string().optional(),
});

export const recommendSchema = z.object({
  history: z.array(activitySchema),
});

export const insightSchema = z.object({
  history: z.array(activitySchema),
  budget: z.number().positive(),
});
