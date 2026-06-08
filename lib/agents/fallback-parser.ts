const KEYWORD_MAP: [RegExp, string, string][] = [
  [/drove|driving|drive|car/i, "transport", "car"],
  [/flew|flight|flying|plane|flight/i, "transport", "flight"],
  [/bus|buss/i, "transport", "bus"],
  [/train|rail|subway|metro/i, "transport", "train"],
  [/bike|biking|bicycle|cycling|cycle/i, "transport", "bike"],
  [/walk|walking|walked/i, "transport", "bike"],
  [/beef|steak|burger|hamburger/i, "food", "beef"],
  [/chicken|poultry/i, "food", "chicken"],
  [/pork|bacon|ham|sausage/i, "food", "pork"],
  [/vegetable|veggie|salad|carrot|broccoli/i, "food", "vegetables"],
  [/rice|grain|cereal/i, "food", "rice"],
  [/electricity|grid|power|energy|electric/i, "energy", "grid_avg"],
  [/solar|renewable/i, "energy", "solar"],
  [/laptop|computer|macbook/i, "shopping", "new_laptop"],
  [/t.?shirt|shirt|tshirt/i, "shopping", "tshirt"],
  [/jeans|denim|pant/i, "shopping", "jeans"],
];

/**
 * Helper to match and extract numeric amount values from natural language query strings.
 *
 * @param {string} input - User raw text query.
 * @returns {number | null} Extracted amount float, or null if match fails.
 */
function extractAmount(input: string): number | null {
  const match = input.match(/(\d+[,.]?\d*)\s*(km|kms|kg|kgs|kwh|item|items|hr|hrs|hour|hours)?/i);
  if (match) return parseFloat(match[1].replace(",", ""));
  return null;
}

/**
 * Robust deterministic pattern fallback analyzer that maps common query terms
 * into standard category entity parameters in case AI APIs are unreachable.
 *
 * @param {string} input - User raw text activity log.
 * @returns {{ category: string; subCategory: string; amount: number }} Resolved parameters.
 */
export function parseFallback(input: string): { category: string; subCategory: string; amount: number } {
  const amount = extractAmount(input) || 1;

  for (const [pattern, cat, sub] of KEYWORD_MAP) {
    if (pattern.test(input)) {
      return { category: cat, subCategory: sub, amount };
    }
  }

  return { category: "transport", subCategory: "car", amount };
}
