
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    subtitle?: string
    action?: React.ReactNode
    className?: string
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6", className)}>
            <div>
                <h1 className="text-4xl font-serif font-black mb-2 text-foreground luxury-text tracking-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground font-medium text-lg">{subtitle}</p>}
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    )
}
