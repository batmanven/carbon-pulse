export interface Activity {
  id: string;
  timestamp: string;
  category: string;
  subCategory: string;
  amount: number;
  unit: string;
  co2e: number;
  equivalent: string;
  rawInput?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number; // in kg CO2e per year
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  active: boolean;
  streak: number;
  completed: boolean;
}
