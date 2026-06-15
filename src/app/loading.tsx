import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100]">
            <div className="text-center space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-10 h-10 animate-spin" />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-serif font-black tracking-tight text-foreground">Syncing your progress...</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Engineering Excellence</p>
                </div>
            </div>
        </div>
    )
}
