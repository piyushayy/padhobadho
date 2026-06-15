"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendEmail } from "@/lib/mail"

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

// Helper to generate 6 digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Action: Send OTP
export async function sendOtp(formData: FormData) {
    const identifier = formData.get("identifier") as string
    const type = formData.get("type") as "EMAIL" | "PHONE"

    const validated = SendOtpSchema.safeParse({ identifier, type })
    if (!validated.success) return { error: "Invalid input" }

    const token = generateOtp()
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000) // 10 minutes

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
            type: // Prisma Enum mapping needs care if types diverge, but here strings match
                type === "EMAIL" ? "EMAIL" : "PHONE",
        },
    })

    // Send Logic
    if (type === "EMAIL") {
        await sendEmail({
            to: identifier,
            subject: "Your OTP Code - PadhoBadho",
            html: `
        <h1>Your OTP Code</h1>
        <p>Your verification code is: <strong>${token}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
        })
    } else if (type === "PHONE") {
        // MOCK SMS
        console.log("======================================")
        console.log(`[MOCK SMS] To: ${identifier} | OTP: ${token}`)
        console.log("======================================")
    }

    return { success: "OTP sent successfully!" }
}

// Action: Verify OTP
export async function verifyOtp(formData: FormData) {
    const identifier = formData.get("identifier") as string
    const token = formData.get("token") as string
    const type = formData.get("type") as "EMAIL" | "PHONE"

    const validated = VerifyOtpSchema.safeParse({ identifier, token, type })
    if (!validated.success) return { error: "Invalid OTP format" }

    const existingToken = await prisma.verificationToken.findFirst({
        where: {
            identifier,
            token,
            type: type === "EMAIL" ? "EMAIL" : "PHONE",
        },
    })

    if (!existingToken) {
        return { error: "Invalid OTP" }
    }

    if (new Date() > existingToken.expires) {
        return { error: "OTP has expired" }
    }

    // Update User Verified Status
    if (type === "EMAIL") {
        await prisma.user.update({
            where: { email: identifier },
            data: { emailVerified: new Date() }
        })
    } else {
        await prisma.user.update({
            where: { phoneNumber: identifier }, // Assume identifier is mapped to phoneNumber
            data: { phoneVerified: new Date() }
        })
    }

    // Clean up used token
    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
    })

    return { success: "Verification successful!" }
}
