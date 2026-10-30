"use client"

import { useState, useTransition, Suspense } from "react"
import { resetPassword } from "@/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

function NewPasswordContent() {
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        if (!token) {
            toast.error("Missing reset token!")
            return
        }
        formData.append("token", token)

        startTransition(async () => {
            const result = await resetPassword(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                router.push("/auth/sign-in")
            }
        })
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6 border p-8 rounded-2xl shadow-xl bg-card text-card-foreground">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-serif font-bold">Reset Password</h1>
                    <p className="text-muted-foreground text-sm">Enter your new password below.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" name="password" type="password" required minLength={6} className="rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
                        {isPending ? "Updating Password..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold">Loading...</div>}>
            <NewPasswordContent />
        </Suspense>
    )
}
