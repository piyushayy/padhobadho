import Link from "next/link"
import { MoveLeft, Ghost } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative inline-block">
                    <Ghost size={120} className="text-primary opacity-20 animate-bounce" />
                    <h1 className="text-[12rem] font-serif font-black text-foreground/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">404</h1>
                </div>
                <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-serif font-black tracking-tight">You've ventured off track.</h2>
                    <p className="text-muted-foreground text-lg max-w-sm mx-auto font-medium"> The page you are looking for has been archived or doesn't exist in our syllabus.</p>
                </div>
                <div className="pt-8">
                    <Link
                        href="/dashboard"
                        className="h-16 px-12 bg-primary text-background rounded-full font-black text-xl gap-3 inline-flex items-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
                    >
                        <MoveLeft size={20} /> Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
