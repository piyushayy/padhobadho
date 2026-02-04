import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Deeply serializes an object to ensuring it is safe to pass from Server to Client Components.
 * Converts Date, BigInt, Decimal, etc. to strings or numbers.
 */
export function serialize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data, (key, value) => {
        // Handle Date
        if (typeof value === 'object' && value !== null && value instanceof Date) {
            return value.toISOString()
        }
        // Handle BigInt (Prisma often returns this)
        if (typeof value === 'bigint') {
            return value.toString()
        }
        return value
    }))
}
