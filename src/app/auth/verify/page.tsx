"use client"

import { useState, useTransition } from "react"
import { sendOtp, verifyOtp } from "@/actions/otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const defaultIdentifier = searchParams.get("identifier") || ""
    const defaultType = (searchParams.get("type") as "EMAIL" | "PHONE") || "EMAIL"

    const [identifier, setIdentifier] = useState(defaultIdentifier)
    const [type, setType] = useState<"EMAIL" | "PHONE">(defaultType)
    const [otpSent, setOtpSent] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleSendOtp = () => {
        if (!identifier) return toast.error("Please enter value")

        startTransition(async () => {
            const formData = new FormData()
            formData.append("identifier", identifier)
            formData.append("type", type)

            const res = await sendOtp(formData)
            if (res.error) toast.error(res.error)
            else {
                toast.success(res.success)
                setOtpSent(true)
            }
        })
    }

    const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append("identifier", identifier)
        formData.append("type", type)

        startTransition(async () => {
            const res = await verifyOtp(formData)
            if (res.error) toast.error(res.error)
            else {
                toast.success(res.success)
                router.push("/dashboard")
            }
        })
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-card text-card-foreground">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Verify {type === "EMAIL" ? "Email" : "Phone"}</h1>
                    <p className="text-gray-500 text-sm">
                        {otpSent
                            ? `Enter the OTP sent to ${identifier}`
                            : "We will send you a verification code."}
                    </p>
                </div>

                {!otpSent ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Method</Label>
                            <div className="flex gap-4 mb-4">
                                <Button
                                    variant={type === "EMAIL" ? "default" : "outline"}
                                    onClick={() => setType("EMAIL")}
                                    className="flex-1"
                                >
                                    Email
                                </Button>
                                <Button
                                    variant={type === "PHONE" ? "default" : "outline"}
                                    onClick={() => setType("PHONE")}
                                    className="flex-1"
                                >
                                    Phone
                                </Button>
                            </div>

                            <Label>{type === "EMAIL" ? "Email Address" : "Phone Number"}</Label>
                            <Input
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={type === "EMAIL" ? "m@example.com" : "+91..."}
                            />
                        </div>
                        <Button onClick={handleSendOtp} className="w-full" disabled={isPending}>
                            {isPending ? "Sending..." : "Send OTP"}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label>OTP Code</Label>
                            <Input name="token" placeholder="123456" maxLength={6} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Verifying..." : "Verify Code"}
                        </Button>
                        <Button
                            variant="link"
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="w-full"
                        >
                            Change {type === "EMAIL" ? "Email" : "Number"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
