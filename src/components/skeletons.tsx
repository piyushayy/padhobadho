export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-muted ${className}`}
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-accent/20 p-12 h-[300px]">
                <div className="space-y-4 max-w-2xl">
                    <Skeleton className="h-12 w-3/4 rounded-2xl" />
                    <Skeleton className="h-6 w-1/2 rounded-xl" />
                    <div className="flex gap-4 mt-8">
                        <Skeleton className="h-14 w-40 rounded-full" />
                        <Skeleton className="h-14 w-40 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="brilliant-card bg-card p-8 h-[200px] flex flex-col justify-between">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-12 w-20" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>

            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="brilliant-card bg-card p-8 h-[120px] flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Skeleton className="w-16 h-16 rounded-[1.5rem]" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <div className="space-y-2 text-right">
                                <Skeleton className="h-8 w-16 ml-auto" />
                                <Skeleton className="h-3 w-12 ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PracticeSkeleton() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <Skeleton className="h-6 w-40 mx-auto rounded-full" />
                <Skeleton className="h-16 w-1/2 mx-auto rounded-2xl" />
                <Skeleton className="h-4 w-1/3 mx-auto rounded-lg" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="brilliant-card bg-card p-8 h-[240px] flex flex-col justify-between">
                        <div className="space-y-4">
                            <Skeleton className="w-14 h-14 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between border-t pt-6 border-border">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
