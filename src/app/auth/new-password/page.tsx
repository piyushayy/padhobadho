"use client"

import { useState, useTransition } from "react"
import { resetPassword } from "@/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        if (!token) {
            toast.error("Missing token!")
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
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">Enter your new password below.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
