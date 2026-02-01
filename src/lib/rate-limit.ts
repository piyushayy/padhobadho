type RateLimitStore = Map<string, number[]>;

const rateLimits: RateLimitStore = new Map();

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

export function rateLimit(ip: string, config: RateLimitConfig = { windowMs: 60 * 1000, max: 5 }) {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const timestamps = rateLimits.get(ip) || [];
    const validTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    if (validTimestamps.length >= config.max) {
        return { success: false };
    }

    validTimestamps.push(now);
    rateLimits.set(ip, validTimestamps);

    // Cleanup old entries periodically (optional, or just let them stay until restart)
    if (rateLimits.size > 10000) {
        rateLimits.clear(); // Brute force cleanup to prevent memory leaks
    }

    return { success: true };
}
