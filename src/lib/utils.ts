import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Deeply serializes an object ensuring it is safe to pass from Server to Client Components.
 * Converts Date, BigInt, Decimal, etc. to strings or numbers.
 */
export function serialize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data, (_key, value) => {
        if (typeof value === 'object' && value !== null && value instanceof Date) {
            return value.toISOString()
        }
        if (typeof value === 'bigint') {
            return value.toString()
        }
        return value
    }))
}

/**
 * Deterministic or random Fisher-Yates shuffle external to component renders.
 */
export function shuffleArray<T>(items: T[]): T[] {
    const arr = [...items]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}
