"use client"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MarkdownContentProps {
    content: string
    className?: string
}

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
    return (
        <div className={`prose dark:prose-invert max-w-none text-foreground ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    h1: ({ ...props }) => (
                        <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight mt-6 mb-4 text-foreground" {...props} />
                    ),
                    h2: ({ ...props }) => (
                        <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight mt-6 mb-3 text-foreground border-b border-border/50 pb-2" {...props} />
                    ),
                    h3: ({ ...props }) => (
                        <h3 className="text-lg md:text-xl font-bold tracking-tight mt-4 mb-2 text-foreground" {...props} />
                    ),
                    p: ({ ...props }) => (
                        <p className="text-muted-foreground leading-relaxed mb-4 text-base" {...props} />
                    ),
                    ul: ({ ...props }) => (
                        <ul className="list-disc list-inside space-y-1.5 mb-4 text-muted-foreground pl-2" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol className="list-decimal list-inside space-y-1.5 mb-4 text-muted-foreground pl-2" {...props} />
                    ),
                    li: ({ ...props }) => (
                        <li className="leading-relaxed" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-primary/50 bg-primary/5 p-4 rounded-r-xl my-4 text-sm font-medium text-foreground not-italic shadow-sm" {...props} />
                    ),
                    code: ({ inline, ...props }: any) => (
                        inline ? (
                            <code className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono font-bold" {...props} />
                        ) : (
                            <code className="block p-4 rounded-xl bg-card border border-border text-foreground text-xs font-mono overflow-x-auto my-3" {...props} />
                        )
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
