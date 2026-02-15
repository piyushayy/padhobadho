"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContact(formData: FormData) {
    // 🛡️ Honeypot Check
    const honeypot = formData.get("website")
    if (honeypot) {
        return { error: "Spam detected." }
    }

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    }

    const result = contactSchema.safeParse(rawData)

    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        await prisma.contactSubmission.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                message: result.data.message,
            }
        })
        return { success: "Message sent! We'll get back to you soon." }
    } catch (error) {
        console.error("Contact form error:", error)
        return { error: "Failed to send message. Please try again later." }
    }
}
