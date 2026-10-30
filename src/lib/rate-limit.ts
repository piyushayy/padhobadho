type RateLimitStore = Map<string, number[]>;

const rateLimits: RateLimitStore = new Map();

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

export function rateLimit(key: string, config: RateLimitConfig = { windowMs: 60 * 1000, max: 5 }) {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const timestamps = rateLimits.get(key) || [];
    const validTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    if (validTimestamps.length >= config.max) {
        return { success: false };
    }

    validTimestamps.push(now);
    rateLimits.set(key, validTimestamps);

    // Controlled cleanup without resetting all active limits
    if (rateLimits.size > 5000) {
        for (const [k, ts] of rateLimits.entries()) {
            const active = ts.filter((t) => t > windowStart);
            if (active.length === 0) {
                rateLimits.delete(k);
            } else {
                rateLimits.set(k, active);
            }
        }
    }

    return { success: true };
}
