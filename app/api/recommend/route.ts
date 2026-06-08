import { NextResponse } from "next/server";
import { getRecommendations } from "../../../lib/agents/recommender";
import { recommendSchema } from "../../../lib/schema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = recommendSchema.parse(body);
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    const recommendations = await getRecommendations(
      validatedData.history,
      apiKeyOverride,
    );
    return NextResponse.json({ recommendations });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid history data provided." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "An unexpected error occurred during recommendation generation.",
      },
      { status: 500 },
    );
  }
}
