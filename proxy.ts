import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 30;

/**
 * Next.js Edge Proxy for rate limiting incoming requests to /api/ routes.
 *
 * @param {NextRequest} req - The incoming network request.
 * @returns {NextResponse} The resolved network response or 429 status page.
 */
export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record || now - record.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Remaining", String(LIMIT - 1));
    return res;
  }

  record.count++;

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, LIMIT - record.count)));

  if (record.count > LIMIT) {
    return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
