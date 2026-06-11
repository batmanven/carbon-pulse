import type { Activity } from "@/lib/types";

export async function sendChatMessage(
  message: string,
  history: Activity[],
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.response || "Sorry, I couldn't process that request.";
}
