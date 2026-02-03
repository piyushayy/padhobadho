"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { sendEmail } from "@/lib/mail"

const ForgotPasswordSchema = z.object({
    email: z.string().email(),
})

const NewPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string(),
})

export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string
    const validatedFields = ForgotPasswordSchema.safeParse({ email })

    if (!validatedFields.success) {
        return { error: "Invalid email address" }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (!existingUser) {
        // For security, do not reveal if user exists or not, but for UX we might just say sent.
        // In this MVP, we'll return success even if user doesn't exist to prevent enumeration.
        return { success: "If an account exists, a reset email has been sent." }
    }

    // Generate Token
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

    // Check if existing token exists, delete or update
    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    })

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    })

    // Send Email with Reset Link
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/new-password?token=${token}`

    await sendEmail({
        to: email,
        subject: "Reset your Password - PadhoBadho",
        html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    })

    return { success: "Reset email sent! Please check your inbox." }
}

export async function resetPassword(formData: FormData) {
    const password = formData.get("password") as string
    const token = formData.get("token") as string

    const validatedFields = NewPasswordSchema.safeParse({ password, token })

    if (!validatedFields.success) {
        return { error: "Invalid password or token" }
    }

    const existingToken = await prisma.verificationToken.findUnique({
        where: { token },
    })

    if (!existingToken) {
        return { error: "Invalid token" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return { error: "Token has expired" }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
    })

    if (!existingUser) {
        return { error: "Email does not exist" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    })

    await prisma.verificationToken.delete({
        where: { token },
    })

    return { success: "Password updated successfully!" }
}
