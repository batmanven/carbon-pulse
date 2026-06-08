import { NextResponse } from "next/server";
import { generateInsight } from "../../../lib/agents/insights";
import { insightSchema } from "../../../lib/schema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = insightSchema.parse(body);
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    const insight = await generateInsight(
      validatedData.history,
      validatedData.budget,
      apiKeyOverride,
    );
    return NextResponse.json({ insight });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid insight data provided." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred during insight generation." },
      { status: 500 },
    );
  }
}
