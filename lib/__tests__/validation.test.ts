import { parseInputSchema, activitySchema, recommendSchema, insightSchema } from "../schema";

describe("Zod Validation Schemas", () => {
  it("should validate a correct parse input", () => {
    const valid = parseInputSchema.safeParse({ input: "I drove 10km" });
    expect(valid.success).toBe(true);
  });

  it("should reject an empty parse input", () => {
    const invalid = parseInputSchema.safeParse({ input: "" });
    expect(invalid.success).toBe(false);
  });

  it("should validate a correct activity object", () => {
    const validActivity = {
      id: "123",
      timestamp: "2026-06-08T12:00:00Z",
      category: "transport",
      subCategory: "car",
      amount: 10,
      unit: "km",
      co2e: 1.7,
      equivalent: "X smartphone charges",
      rawInput: "drove 10km"
    };
    const valid = activitySchema.safeParse(validActivity);
    expect(valid.success).toBe(true);
  });

  it("should validate recommend schema with history array", () => {
    const valid = recommendSchema.safeParse({ history: [] });
    expect(valid.success).toBe(true);
  });

  it("should validate insight schema with history and positive budget", () => {
    const valid = insightSchema.safeParse({ history: [], budget: 10 });
    expect(valid.success).toBe(true);
  });

  it("should reject insight schema with zero or negative budget", () => {
    const invalid = insightSchema.safeParse({ history: [], budget: -5 });
    expect(invalid.success).toBe(false);
  });
});
