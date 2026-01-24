"use client"

import { RotateCcw, AlertTriangle } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-rose-500/30">
                <div className="text-center space-y-8 max-w-lg">
                    <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <AlertTriangle size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-serif font-black tracking-tight">System Critical</h1>
                        <p className="text-zinc-400 font-medium text-xl leading-relaxed">
                            A critical error occurred in the root application layer. We need to perform a full system reset.
                        </p>
                    </div>

                    <button
                        onClick={() => reset()}
                        className="h-16 px-12 bg-white text-black rounded-full font-black text-xl gap-3 inline-flex items-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-rose-900/20"
                    >
                        <RotateCcw size={20} /> Reboot System
                    </button>
                </div>
            </body>
        </html>
    )
}
