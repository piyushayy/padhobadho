import { auth } from "@/auth"
import { getFeedback, getContactSubmissions } from "@/actions/admin"
import { FeedbackManager } from "./feedback-manager"

export default async function AdminFeedbackPage() {
    const [feedback, inquiries] = await Promise.all([
        getFeedback(),
        getContactSubmissions()
    ])

    return (
        <FeedbackManager
            initialFeedback={feedback}
            initialInquiries={inquiries}
        />
    )
}
