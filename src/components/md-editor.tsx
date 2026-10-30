"use client"

import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
)

interface MarkdownEditorProps {
    value: string
    onChange: (value?: string) => void
    height?: number
}

export function MarkdownEditor({ value, onChange, height = 300 }: MarkdownEditorProps) {
    return (
        <div data-color-mode="light" className="mb-4">
            <MDEditor
                value={value}
                onChange={onChange}
                height={height}
                preview="live"
            />
        </div>
    )
}
