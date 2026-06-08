import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CLEANUP_INTERVAL = 3_600_000;
interface RateLimitEntry { count: number; lastReset: number }

export function createRateLimiter(windowMs = 60_000, limit = 30) {
  const rateLimitMap = new Map<string, RateLimitEntry>();

  const cleanup = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, entry] of rateLimitMap) {
      if (entry.lastReset < cutoff) rateLimitMap.delete(key);
    }
  }, CLEANUP_INTERVAL);

  if (cleanup.unref) cleanup.unref();

  return function check(req: NextRequest): ReturnType<typeof NextResponse.next> | Response {
    if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const now = Date.now();

    const record = rateLimitMap.get(ip);
    if (!record || now - record.lastReset > windowMs) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
      const res = NextResponse.next();
      res.headers.set("X-RateLimit-Remaining", String(limit - 1));
      return res;
    }

    record.count++;
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Remaining", String(Math.max(0, limit - record.count)));

    if (record.count > limit) {
      return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    return res;
  };
}

const check = createRateLimiter();

export function proxy(req: NextRequest) {
  return check(req);
}

export const config = {
  matcher: ["/api/:path*"],
};
