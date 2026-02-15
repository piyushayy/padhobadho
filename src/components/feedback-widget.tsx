"use client"

import { useState } from "react"
import { MessageSquare, X, Loader2, Send } from "lucide-react"
import { submitFeedback } from "@/actions/submit-feedback"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        const result = await submitFeedback(formData)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Feedback sent!")
            setIsOpen(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all font-bold text-sm"
            >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden md:inline">Feedback</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:justify-end sm:px-6 sm:pb-6">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full sm:w-[400px] bg-card border border-border sm:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 sm:slide-in-from-right-10 duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-lg font-serif font-bold">Help us improve</h3>
                            <p className="text-sm text-muted-foreground">Found a bug or have a suggestion? Let us know!</p>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["GENERAL", "BUG", "FEATURE"].map((type) => (
                                        <label key={type} className="cursor-pointer">
                                            <input type="radio" name="type" value={type} className="peer sr-only" defaultChecked={type === "GENERAL"} />
                                            <div className="text-center px-2 py-2 rounded-lg border border-border text-xs font-medium peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all hover:bg-muted">
                                                {type}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    placeholder="Tell us what you think..."
                                    className="w-full min-h-[120px] p-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-sm transition-all"
                                />
                            </div>

                            {/* Honeypot field */}
                            <div className="hidden" aria-hidden="true">
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
