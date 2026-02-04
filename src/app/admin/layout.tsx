import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Layers, PlusCircle, LogOut, ShieldCheck, ChevronRight, Library, Briefcase, FileUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Strict role check
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-card border-r hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center dark:bg-white dark:text-black">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-serif font-black tracking-tighter">ADMIN</span>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Management</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-1">
                    <Link href="/admin" className="flex items-center justify-between px-4 py-3.5 bg-accent text-foreground rounded-2xl font-bold transition-all">
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                    <Link href="/admin/questions" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5" /> Questions
                        </div>
                    </Link>
                    <Link href="/admin/subjects" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5" /> Subjects & Topics
                        </div>
                    </Link>
                    <Link href="/admin/resources" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <Library className="w-5 h-5" /> Resource Library
                        </div>
                    </Link>
                    <Link href="/admin/students" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <PlusCircle className="w-5 h-5 rotate-45" /> Student Directory
                        </div>
                    </Link>
                    <Link href="/admin/questions/bulk-upload" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <FileUp className="w-5 h-5" /> CSV Upload Questions
                        </div>
                    </Link>
                    <Link href="/admin/courses" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <Library className="w-5 h-5" /> Courses
                        </div>
                    </Link>
                    <Link href="/admin/careers" className="flex items-center justify-between px-4 py-3.5 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all hover:text-foreground">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5" /> Careers
                        </div>
                    </Link>
                </nav>

                <div className="p-6 mt-auto border-t border-border">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-semibold transition-all">
                        <LayoutDashboard className="w-5 h-5" /> Student View
                    </Link>
                    <button className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl font-semibold transition-all">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Admin Area */}
            <main className="flex-1 min-w-0 flex flex-col">
                <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status: <span className="text-emerald-500 animate-pulse">Running</span></h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="flex items-center gap-4 border-l pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold">{session?.user?.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold dark:bg-white dark:text-black">
                                {session?.user?.name?.[0]}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
