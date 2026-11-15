import { getJobs } from "@/actions/careers"
import { CareersClient } from "./careers-client"

export const metadata = {
    title: "Careers & Openings | PadhoBadho",
    description: "Join our mission to democratize education across India. Open roles: SEA/SEO Growth Specialist, Social Media Marketing Manager, and Web Developer.",
}

export default async function CareersPage() {
    const { jobs } = await getJobs()

    return (
        <div className="min-h-screen bg-background py-12 md:py-20">
            <main className="container mx-auto px-4 md:px-6 max-w-5xl">
                <CareersClient jobs={jobs || []} />
            </main>
        </div>
    )
}
