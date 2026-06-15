import Link from "next/link"
import { getJobs } from "@/actions/careers"
import { MapPin, Clock, Briefcase, ArrowRight, ArrowLeft } from "lucide-react"

export default async function CareersPage() {
    const { jobs, error } = await getJobs()

    return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-6 py-24 max-w-5xl">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-black">Build the Future of EdTech.</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join us in our mission to personalize education for every student in India.
                        We are looking for passionate builders, not just employees.
                    </p>
                    <div className="pt-4">
                        <a href="mailto:piyushkaushik121@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                            Or email us directly: piyushkaushik121@gmail.com
                        </a>
                    </div>
                </div>

                <div className="grid gap-6">
                    {!jobs || jobs.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-[2rem] bg-muted/20">
                            <h3 className="text-xl font-bold mb-2">No Openings Currently</h3>
                            <p className="text-muted-foreground">We aren't hiring right now, but check back soon!</p>
                        </div>
                    ) : (
                        jobs.map((job: any) => (
                            <div key={job.id} className="group relative bg-card p-8 rounded-[2rem] border hover:border-primary/50 transition-all hover:shadow-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.department}</span>
                                                <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 max-w-2xl">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        <Link
                                            href={job.applicationLink || `mailto:${job.email}?subject=Application for ${job.title}`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            Apply Now <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
