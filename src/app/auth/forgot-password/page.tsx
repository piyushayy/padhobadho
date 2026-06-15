"use client"

import { useState, useTransition } from "react"
import { forgotPassword } from "@/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            const result = await forgotPassword(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
            }
        })
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Forgot Password?</h1>
                    <p className="text-gray-500 dark:text-gray-400">Enter your email to reset your password.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Sending Reset Email..." : "Send Reset Email"}
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <Link href="/auth/sign-in" className="underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}
