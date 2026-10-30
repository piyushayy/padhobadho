import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 120; // 120 requests per minute

const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    const requestLog = rateLimitMap.get(ip) || [];
    const requestsInWindow = requestLog.filter((timestamp) => timestamp > windowStart);

    if (requestsInWindow.length >= MAX_REQUESTS) {
        return true; // Rate limit exceeded
    }

    requestsInWindow.push(now);
    rateLimitMap.set(ip, requestsInWindow);

    // Controlled cleanup without resetting all active limits
    if (rateLimitMap.size > 5000) {
        for (const [key, timestamps] of rateLimitMap.entries()) {
            const active = timestamps.filter(t => t > windowStart);
            if (active.length === 0) rateLimitMap.delete(key);
            else rateLimitMap.set(key, active);
        }
    }

    return false;
}

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // API rate limiting
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
        if (checkRateLimit(ip)) {
            return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
                status: 429,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

