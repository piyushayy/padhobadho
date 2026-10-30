"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendEmail } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"
import crypto from "crypto"

// Schema
const SendOtpSchema = z.object({
    identifier: z.string().min(1, "Email or Phone is required"),
    type: z.enum(["EMAIL", "PHONE"]),
})

const VerifyOtpSchema = z.object({
    identifier: z.string().min(1),
    token: z.string().length(6, "OTP must be 6 digits"),
    type: z.enum(["EMAIL", "PHONE"]),
})

// Cryptographically secure 6-digit OTP
function generateOtp() {
    return crypto.randomInt(100000, 1000000).toString()
}

// Action: Send OTP
export async function sendOtp(formData: FormData) {
    const identifier = (formData.get("identifier") as string)?.trim()
    const type = formData.get("type") as "EMAIL" | "PHONE"

    const validated = SendOtpSchema.safeParse({ identifier, type })
    if (!validated.success) return { error: "Invalid input" }

    const limit = rateLimit(`send_otp_${identifier}`, { windowMs: 60 * 1000, max: 3 })
    if (!limit.success) return { error: "Too many OTP requests. Please wait a minute." }

    const token = generateOtp()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete existing tokens for this identifier
    await prisma.verificationToken.deleteMany({
        where: { identifier },
    })

    // Save new token
    await prisma.verificationToken.create({
        data: {
            identifier,
            token,
            expires,
            type: type === "EMAIL" ? "EMAIL" : "PHONE",
        },
    })

    // Send Logic
    if (type === "EMAIL") {
        const mailRes = await sendEmail({
            to: identifier,
            subject: "Your OTP Code - PadhoBadho",
            html: `
        <h1>Your OTP Code</h1>
        <p>Your verification code is: <strong>${token}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
        })

        if (!mailRes.success) {
            return { error: "Failed to dispatch verification email. Please verify SMTP settings." }
        }
    } else if (type === "PHONE") {
        console.log("======================================")
        console.log(`[SMS DISPATCH] To: ${identifier} | OTP: ${token}`)
        console.log("======================================")
    }

    return { success: "OTP sent successfully!" }
}

// Action: Verify OTP
export async function verifyOtp(formData: FormData) {
    const identifier = (formData.get("identifier") as string)?.trim()
    const token = (formData.get("token") as string)?.trim()
    const type = formData.get("type") as "EMAIL" | "PHONE"

    const validated = VerifyOtpSchema.safeParse({ identifier, token, type })
    if (!validated.success) return { error: "Invalid OTP format" }

    // Rate-limit verification attempts to prevent brute-force (max 5 attempts per 5 minutes)
    const limit = rateLimit(`verify_otp_${identifier}`, { windowMs: 5 * 60 * 1000, max: 5 })
    if (!limit.success) {
        return { error: "Too many failed attempts. Please request a new OTP after 5 minutes." }
    }

    const existingToken = await prisma.verificationToken.findFirst({
        where: {
            identifier,
            token,
            type: type === "EMAIL" ? "EMAIL" : "PHONE",
        },
    })

    if (!existingToken) {
        return { error: "Invalid OTP code" }
    }

    if (new Date() > existingToken.expires) {
        return { error: "OTP has expired. Please request a new one." }
    }

    // Update User Verified Status safely
    try {
        if (type === "EMAIL") {
            await prisma.user.updateMany({
                where: { email: identifier },
                data: { emailVerified: new Date() }
            })
        } else {
            await prisma.user.updateMany({
                where: { phoneNumber: identifier },
                data: { phoneVerified: new Date() }
            })
        }
    } catch (err) {
        console.error("Verification user update error:", err)
    }

    // Clean up used token
    await prisma.verificationToken.deleteMany({
        where: { identifier, token },
    })

    return { success: "Verification successful!" }
}
