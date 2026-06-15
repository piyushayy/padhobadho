"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { MessageSquare, Mail, Calendar, User, UserX } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function FeedbackManager({ initialFeedback, initialInquiries }: { initialFeedback: any[], initialInquiries: any[] }) {
    const [activeTab, setActiveTab] = useState<'platform' | 'public'>('platform')

    return (
        <div className="space-y-8">
            <PageHeader
                title="Feedback & Inquiries"
                subtitle="Manage user feedback and public contact form submissions."
            />

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab('platform')}
                    className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'platform'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <MessageSquare size={16} />
                    Platform Feedback
                    <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs">{initialFeedback.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('public')}
                    className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'public'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Mail size={16} />
                    Public Inquiries
                    <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs">{initialInquiries.length}</span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'platform' ? (
                    initialFeedback.length === 0 ? (
                        <EmptyState message="No platform feedback yet." />
                    ) : (
                        initialFeedback.map((item) => (
                            <div key={item.id} className="bg-card border border-border p-6 rounded-xl flex gap-4 hover:border-primary/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden">
                                    {item.user.image ? (
                                        <img src={item.user.image} alt={item.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        item.user.name?.[0]
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold">{item.user.name}</h4>
                                            <p className="text-xs text-muted-foreground">{item.user.email}</p>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider border ${item.type === 'BUG' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                item.type === 'FEATURE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-muted text-muted-foreground border-border'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                                        {item.message}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar size={12} />
                                        {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")} ({dayjs(item.createdAt).fromNow()})
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    initialInquiries.length === 0 ? (
                        <EmptyState message="No public inquiries yet." />
                    ) : (
                        initialInquiries.map((item) => (
                            <div key={item.id} className="bg-card border border-border p-6 rounded-xl flex gap-4 hover:border-primary/50 transition-colors relative group">
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0">
                                    <User size={18} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold">{item.name}</h4>
                                            <a href={`mailto:${item.email}`} className="text-xs text-primary hover:underline font-medium">{item.email}</a>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm bg-muted/30 p-3 rounded-lg border border-border/50 font-serif italic text-foreground/80">
                                        "{item.message}"
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar size={12} />
                                        {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-muted rounded-xl">
            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <UserX size={24} />
            </div>
            <p className="font-bold text-muted-foreground">{message}</p>
        </div>
    )
}
