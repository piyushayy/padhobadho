import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Simple in-memory rate limiting (Note: This resets on server restart/redeploy)
// For production, use Vercel KV or Upstash
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    const requestLog = rateLimitMap.get(ip) || [];
    const requestsInWindow = requestLog.filter((timestamp) => timestamp > windowStart);

    if (requestsInWindow.length >= MAX_REQUESTS) {
        return true; // Rate limit exceeded
    }

    requestsInWindow.push(now);
    rateLimitMap.set(ip, requestsInWindow);
    return false;
}

export default function proxy(req: NextRequest, event: any) {
    const { pathname } = req.nextUrl;

    // 1. Rate limiting for API requests
    if (pathname.startsWith("/api")) {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        if (checkRateLimit(ip)) {
            return new NextResponse("Too Many Requests", { status: 429 });
        }
        return NextResponse.next();
    }

    // 2. NextAuth session check/redirection for page routes
    return auth(req, event);
}

export const config = {
    // Match everything except static assets
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
