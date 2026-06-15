import { getJobs } from "@/actions/careers"
import AdminCareersPage from "./admin-careers-client"

export default async function Page() {
    const { jobs } = await getJobs()
    return <AdminCareersPage jobs={jobs || []} />
}
