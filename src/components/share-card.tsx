"use client"

import { useState } from "react"
import { Share2, Copy, Check, Sparkles, Trophy, Send } from "lucide-react"
import { toast } from "sonner"

interface ShareCardProps {
    title: string
    subtitle?: string
    score: number | string
    accuracy?: number | string
    percentile?: number | string
    shareUrl?: string
    className?: string
}

export function ShareCard({
    title,
    subtitle = "PadhoBadho 100% Free Learning",
    score,
    accuracy,
    percentile = 85,
    shareUrl = "https://padhobadho.com/practice",
    className = ""
}: ShareCardProps) {
    const [copied, setCopied] = useState(false)

    const shareText = `🎯 I scored ${score} ${accuracy ? `(${accuracy}% accuracy)` : ""} on ${title} on PadhoBadho! 🔥\nCan you beat my score? Attempt 100% free entrance exam practice & mocks here: ${shareUrl}`

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(shareText)
            setCopied(true)
            toast.success("Scorecard copied! Paste to Instagram, WhatsApp, or Telegram.")
            setTimeout(() => setCopied(false), 2500)
        } catch {
            toast.error("Failed to copy scorecard.")
        }
    }

    async function handleNativeShare() {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `My PadhoBadho Score: ${title}`,
                    text: shareText,
                    url: shareUrl
                })
            } catch {
                // User cancelled or share blocked
            }
        } else {
            handleCopy()
        }
    }

    return (
        <div className={`bg-gradient-to-br from-card via-card to-primary/10 border-2 border-primary/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 ${className}`}>
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-black text-xs">
                        PB
                    </span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">Official Scorecard</p>
                        <p className="text-xs text-muted-foreground font-semibold">{subtitle}</p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={11} /> Top {100 - Number(percentile || 85)}% Tier
                </div>
            </div>

            {/* Scorecard Body */}
            <div className="text-center py-4 space-y-2 border-y border-border/50">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl sm:text-6xl font-serif font-black text-foreground tracking-tight">
                        {score}
                    </span>
                    {accuracy !== undefined && (
                        <span className="text-xl sm:text-2xl font-black text-primary font-mono">
                            {accuracy}% Acc
                        </span>
                    )}
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                    ⚡ Faster & more accurate than {percentile}% of aspirants in India
                </p>
            </div>

            {/* Share Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                    <Send size={14} />
                    <span>Share on WhatsApp</span>
                </a>

                <div className="flex gap-2">
                    <button
                        onClick={handleNativeShare}
                        className="flex-1 py-3 px-4 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
                    >
                        <Share2 size={14} />
                        <span>Story / Social</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className="py-3 px-3.5 bg-muted/60 hover:bg-muted text-foreground rounded-xl transition-colors flex items-center justify-center border border-border/60 cursor-pointer"
                        title="Copy Scorecard"
                        aria-label="Copy scorecard text"
                    >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    )
}
