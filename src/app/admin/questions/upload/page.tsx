"use client"

import { useState } from "react"
import { bulkUploadQuestions } from "@/actions/admin"
import { toast } from "sonner"
import { Upload, FileJson, AlertCircle, CheckCircle2 } from "lucide-react"

export default function BulkUploadPage() {
    const [loading, setLoading] = useState(false)
    const [jsonInput, setJsonInput] = useState("")

    const handleUpload = async () => {
        if (!jsonInput.trim()) {
            return toast.error("Please paste your JSON content.")
        }

        try {
            setLoading(true)
            const data = JSON.parse(jsonInput)

            if (!Array.isArray(data)) {
                return toast.error("Input must be a JSON array.")
            }

            const result = await bulkUploadQuestions(data)

            if (result.success > 0) {
                toast.success(`Successfully uploaded ${result.success} questions!`)
                setJsonInput("")
            }

            if (result.failed > 0) {
                toast.error(`Failed to upload ${result.failed} questions. Check details.`)
            }
        } catch (err) {
            toast.error("Invalid JSON format.")
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result as string
            setJsonInput(content)
            toast.success("File loaded successfully!")
        }
        reader.readAsText(file)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-serif font-black mb-4 text-foreground luxury-text">Bulk Question Upload</h1>
                <p className="text-muted-foreground font-medium">Populate the platform with questions instantly using JSON data.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <label className="brilliant-card bg-card border-2 border-dashed border-primary/20 flex flex-col items-center justify-center py-20 gap-4 group hover:border-primary transition-all cursor-pointer">
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileJson className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-xl text-foreground">Upload JSON File</p>
                            <p className="text-sm text-muted-foreground font-medium italic">Click to browse your computer</p>
                        </div>
                    </label>

                    <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
                            <div>
                                <h4 className="font-bold text-amber-900 dark:text-amber-400">JSON Structure Required</h4>
                                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed mt-2">
                                    Your JSON must be an array of objects containing <code className="bg-amber-200/50 px-1 rounded dark:bg-amber-900/50">subject</code>, <code className="bg-amber-200/50 px-1 rounded dark:bg-amber-900/50">topic</code>, <code className="bg-amber-200/50 px-1 rounded dark:bg-amber-900/50">content</code>, <code className="bg-amber-200/50 px-1 rounded dark:bg-amber-900/50">options</code> (Array), and <code className="bg-amber-200/50 px-1 rounded dark:bg-amber-900/50">correctOption</code> (Index 0-3).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='[ { "subject": "Math", "topic": "Calculus", ... } ]'
                        className="w-full h-96 p-8 bg-card border-2 rounded-[2.5rem] font-mono text-sm focus:border-primary focus:ring-0 transition-all outline-none resize-none text-foreground shadow-inner"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? "Processing..." : <><Upload className="w-6 h-6" /> Upload Questions</>}
                    </button>
                </div>
            </div>
        </div>
    )
}
