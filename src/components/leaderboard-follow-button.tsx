"use client"

import { useState } from "react"
import { toggleFollowUser } from "@/actions/friends"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function LeaderboardFollowButton({
    targetUserId,
    isFollowingInitial
}: {
    targetUserId: string
    isFollowingInitial: boolean
}) {
    const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
    const [isLoading, setIsLoading] = useState(false)

    async function handleToggle() {
        setIsLoading(true)
        try {
            const res = await toggleFollowUser(targetUserId)
            if (res.success) {
                setIsFollowing(res.isFollowing)
                toast.success(res.isFollowing ? "Added to your Friends leaderboard! 👥" : "Removed from Friends")
            }
        } catch {
            toast.error("Failed to update follow status")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isFollowing
                    ? "bg-primary/15 text-primary border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
            }`}
            title={isFollowing ? "Following friend (Click to unfollow)" : "Follow study buddy"}
        >
            {isLoading ? (
                <Loader2 size={12} className="animate-spin" />
            ) : isFollowing ? (
                <UserCheck size={12} />
            ) : (
                <UserPlus size={12} />
            )}
        </button>
    )
}
