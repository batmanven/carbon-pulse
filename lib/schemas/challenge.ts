import { z } from "zod";

export const challengeBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const challengeSchema = challengeBaseSchema.extend({
  active: z.boolean(),
  streak: z.number().nonnegative(),
  completed: z.boolean(),
});
