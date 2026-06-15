"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { submitContact } from "@/actions/contact"
import { toast } from "sonner"

export function ContactForm() {
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)

        const formData = new FormData(e.currentTarget)
        const result = await submitContact(formData)

        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success as string);
            (e.target as HTMLFormElement).reset()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input
                        name="name"
                        required
                        type="text"
                        className="w-full h-12 bg-background border border-border focus:border-primary rounded-xl px-4 font-bold outline-none transition-all placeholder:font-normal"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <input
                        name="email"
                        required
                        type="email"
                        className="w-full h-12 bg-background border border-border focus:border-primary rounded-xl px-4 font-bold outline-none transition-all placeholder:font-normal"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                    name="message"
                    required
                    className="w-full h-40 bg-background border border-border focus:border-primary rounded-xl p-4 font-bold outline-none transition-all resize-none placeholder:font-normal"
                    placeholder="How can we help you?"
                ></textarea>
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

            <button
                disabled={isPending}
                className="h-14 w-full bg-primary text-background rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none"
            >
                {isPending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {isPending ? "Sending..." : "Dispatch Message"}
            </button>
        </form>
    )
}
