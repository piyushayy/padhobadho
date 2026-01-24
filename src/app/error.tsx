"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center space-y-8 max-w-md animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={48} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Something skipped a beat.</h2>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        We encountered a technical hurdle while processing your request. Our engineers have been notified.
                    </p>
                    {process.env.NODE_ENV === "development" && (
                        <div className="p-4 bg-rose-500/5 text-rose-500 text-xs font-mono rounded-xl text-left border border-rose-500/10 overflow-auto max-h-32">
                            {error.message}
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <button
                        onClick={() => reset()}
                        className="h-16 px-12 bg-foreground text-background rounded-full font-black text-xl gap-3 inline-flex items-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        <RotateCcw size={20} /> Attempt Recovery
                    </button>
                </div>
            </div>
        </div>
    )
}
