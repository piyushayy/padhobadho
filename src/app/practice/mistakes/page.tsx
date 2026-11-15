import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getMistakeBankQuestions } from "@/actions/mistakes"
import MistakeBankClient from "./mistake-bank-client"
import AppLayout from "@/components/app-layout"

export const dynamic = "force-dynamic"

export default async function MistakeBankPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/sign-in")

    const mistakes = await getMistakeBankQuestions()

    return (
        <AppLayout session={session}>
            <MistakeBankClient initialMistakes={mistakes} />
        </AppLayout>
    )
}
