import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminTicketsPage() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") redirect("/")

    const tickets = await prisma.feedback.findMany({
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-serif font-black mb-2 text-foreground luxury-text">Support Tickets</h1>
                <p className="text-muted-foreground font-medium">View and manage user reports and feedback.</p>
            </div>

            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-[2rem] text-muted-foreground">
                        No tickets found.
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${ticket.type === "BUG" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                                        ticket.type === "FEATURE" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                            "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    }`}>
                                    {ticket.type}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-lg font-medium text-foreground mb-4 whitespace-pre-line">
                                {ticket.message}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {ticket.user.name?.[0]}
                                </div>
                                <span className="font-bold text-foreground">{ticket.user.name}</span>
                                <span>&bull;</span>
                                <span>{ticket.user.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
