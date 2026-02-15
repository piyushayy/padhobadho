"use client"

import { useState } from "react"
import { Copy, Check, Heart, QrCode } from "lucide-react"
import { toast } from "sonner"

export function DonationSection() {
    const [copied, setCopied] = useState(false)
    const upiId = "piyushkaushik121@okicici" // Replace with actual UPI ID if different

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId)
        setCopied(true)
        toast.success("UPI ID copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="py-20 bg-muted/30 border-t border-border mt-20">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <div className="mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 mb-4 animate-pulse">
                        <Heart className="w-8 h-8 fill-current" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight">Support Our Mission</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        PadhoBadho is a community-driven project. Your contributions help us keep the servers running and education free for everyone.
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-card rounded-3xl border border-border shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="p-8 relative z-10">
                        <div className="mb-6 flex flex-col items-center">
                            <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-border">
                                <QrCode className="w-10 h-10 text-foreground/80" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Direct UPI Transfer</p>
                        </div>

                        <div className="flex items-center gap-2 bg-background border border-border p-2 pr-2 pl-4 rounded-xl shadow-sm mb-6">
                            <code className="text-lg font-mono font-bold text-foreground flex-1 text-center truncate">
                                {upiId}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                                title="Copy UPI ID"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="text-xs text-center text-muted-foreground font-medium">
                            Scan via PhonePe, Google Pay, Paytm, or any UPI app.
                        </div>
                    </div>

                    {/* Decorative bottom bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
                </div>
            </div>
        </section>
    )
}
