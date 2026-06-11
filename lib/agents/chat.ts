import { getAIClient, generateTextSafe } from "@/lib/agents/client";
import type { Activity } from "@/lib/types";
import {
  formatActivityDetailLine,
  formatRecentActivities,
} from "@/lib/utils/activity-context";
import { buildChatPrompt } from "./prompts/chat.prompt";

export async function generateChatResponse(
  message: string,
  history: Activity[],
  apiKeyOverride?: string,
): Promise<string> {
  const ai = getAIClient(apiKeyOverride);

  const activitiesContext = formatRecentActivities(
    history,
    formatActivityDetailLine,
  );
  const totalEmissions = history.reduce((sum, a) => sum + a.co2e, 0);
  const prompt = buildChatPrompt(
    activitiesContext,
    totalEmissions,
    history.length,
    message,
  );

  const response = await generateTextSafe(ai, prompt);
  return response || "";
}
