"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global Error:", error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex h-screen w-full flex-col items-center justify-center p-8 text-center bg-zinc-950 text-white font-sans">
                    <div className="space-y-6 max-w-md">
                        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">System Critical Error</h2>
                        <p className="text-zinc-400 font-medium">
                            A critical error occurred while rendering the application. This is usually temporary.
                        </p>
                        <div className="flex gap-4 justify-center pt-4">
                            <button
                                onClick={() => reset()}
                                className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                Try Again
                            </button>
                            <Link href="/" className="px-6 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-bold hover:bg-zinc-700 transition-colors">
                                Go Home
                            </Link>
                        </div>
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-8 p-4 bg-zinc-900 rounded-xl text-left font-mono text-xs overflow-auto max-h-48 border border-zinc-800">
                                <p className="text-rose-500 font-bold mb-2">{error.name}: {error.message}</p>
                                <pre className="text-zinc-500">{error.stack}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </body>
        </html>
    )
}
