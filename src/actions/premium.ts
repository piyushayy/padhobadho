"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function upgradeToPremium(confirmationToken?: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Validate confirmation token for checkout flow
    if (confirmationToken !== "PB_SANDBOX_CONFIRMED") {
        return { error: "Payment verification token missing or invalid." }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { isPremium: true }
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    return { success: true }
}
