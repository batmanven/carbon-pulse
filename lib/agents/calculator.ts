import { calculateEmissions, EMISSION_FACTORS } from "@/lib/emissions";
import { getEquivalent } from "@/lib/equivalents";
import { Activity } from "@/lib/types";

/**
 * Computes emission volumes and real-world equivalents for an incoming activity entity,
 * maps them to proper activity properties, and returns it.
 *
 * @param {string} category - The emission category (transport, food, energy, shopping).
 * @param {string} subCategory - The specific activity subcategory (car, beef, etc.).
 * @param {number} amount - Numeric measurement volume of activity.
 * @param {string} [rawInput] - Raw user textual query description.
 * @param {string} [region] - Optional grid multiplier region identifier.
 * @returns {Omit<Activity, "id" | "timestamp">} Calculated partial activity entity properties.
 */
export function calculateActivityEmissions(
  category: string,
  subCategory: string,
  amount: number,
  rawInput?: string,
  region?: string,
): Omit<Activity, "id" | "timestamp"> {
  const co2e = calculateEmissions(category, subCategory, amount, region);
  const equivalent = getEquivalent(co2e);

  const factors = EMISSION_FACTORS as Record<string, Record<string, { unit: string; value: number }>>;
  const unit = factors[category]?.[subCategory]?.unit || "unknown";

  return {
    category,
    subCategory,
    amount,
    unit,
    co2e,
    equivalent,
    rawInput,
  };
}
