"use client"

import { useState, useTransition, useEffect } from "react"
import { bulkUploadQuestions } from "@/actions/bulk-upload"
import { getSubjects } from "@/actions/questions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AlertCircle, CheckCircle, FileUp, Download } from "lucide-react"

export default function BulkUploadPage() {
    const [isPending, startTransition] = useTransition()
    const [report, setReport] = useState<{ count?: number, errors?: string[] } | null>(null)

    const [subjects, setSubjects] = useState<any[]>([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedTopic, setSelectedTopic] = useState("")

    useEffect(() => {
        getSubjects().then(setSubjects)
    }, [])

    const activeTopics = subjects.find(s => s.id === selectedSubject)?.topics || []

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setReport(null)
        const formData = new FormData(e.currentTarget)

        // Append manually controlled selects just in case, though form inputs should handle it
        if (selectedSubject) formData.set("subjectId", selectedSubject)
        if (selectedTopic) formData.set("topicId", selectedTopic)

        startTransition(async () => {
            const res = await bulkUploadQuestions(formData) as any
            if (res.error) {
                toast.error(res.error)
            } else {
                setReport(res)
                if (res.count > 0) toast.success(`Imported ${res.count} questions!`)
                if (res.errors) toast.warning(`Some rows failed to import.`)
            }
        })
    }

    const downloadTemplate = () => {
        const headers = selectedSubject
            ? "difficulty,question,option1,option2,option3,option4,correctOption,explanation"
            : "subject,topic,difficulty,question,option1,option2,option3,option4,correctOption,explanation"

        const example = selectedSubject
            ? "EASY,What is 2+2?,3,4,5,None,B,Basic arithmetic."
            : "Mathematics,Algebra,EASY,What is 2+2?,3,4,5,None,B,Basic arithmetic."

        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "question_template.csv")
        document.body.appendChild(link)
        link.click()
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Bulk Upload Questions</h1>
                <p className="text-muted-foreground">Upload questions via CSV. Select Subject/Topic below to use a simplified CSV format.</p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-6">

                {/* Scope Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Subject (Optional)</Label>
                        <select
                            name="subjectId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">Detect from CSV</option>
                            {subjects.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Topic (Optional)</Label>
                        <select
                            name="topicId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">Detect from CSV</option>
                            {activeTopics.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md border border-dashed">
                    <div className="text-sm">
                        <strong>Expected CSV Format:</strong>
                        <p className="text-muted-foreground mt-1 text-xs font-mono">
                            {selectedSubject
                                ? "difficulty,question,option1,option2,option3,option4,correctOption,explanation"
                                : "subject,topic,difficulty,question,option1,option2,option3,option4,correctOption,explanation"}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
                        <Download size={16} /> Template
                    </Button>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="csv">Upload CSV File</Label>
                        <div className="flex gap-2">
                            <Input id="csv" name="csv_file" type="file" accept=".csv" required className="cursor-pointer" />
                            <Button type="submit" disabled={isPending} className="gap-2">
                                {isPending ? "Importing..." : <><FileUp size={18} /> Import</>}
                            </Button>
                        </div>
                    </div>
                </form>

                {report && (
                    <div className="space-y-4 pt-4 border-t">
                        {report.count !== undefined && (
                            <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-md">
                                <CheckCircle size={20} />
                                Successfully imported {report.count} questions.
                            </div>
                        )}

                        {report.errors && report.errors.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-destructive font-medium">
                                    <AlertCircle size={20} />
                                    Errors ({report.errors.length})
                                </div>
                                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md max-h-60 overflow-y-auto font-mono">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {report.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
