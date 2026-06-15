"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { createDiscussion } from "@/actions/discussion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CreateDiscussionModal({ subjects }: { subjects: { id: string, name: string }[] }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        const formData = new FormData(e.currentTarget)
        const result = await createDiscussion(formData)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Discussion published!")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                    <Plus size={20} /> New Discussion
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Start a Discussion</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Subject (Optional)</label>
                        <select name="subjectId" className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                            <option value="">General Discussion</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Title</label>
                        <input
                            name="title"
                            required
                            minLength={5}
                            placeholder="e.g. How to solve Integration by parts?"
                            className="w-full h-10 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Content</label>
                        <textarea
                            name="content"
                            required
                            minLength={10}
                            placeholder="Describe your question or topic in detail..."
                            className="w-full h-32 rounded-lg border bg-background p-3 focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            disabled={isPending}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Publish
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
