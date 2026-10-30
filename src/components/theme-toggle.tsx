"use client"

import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        queueMicrotask(() => {
            const root = document.documentElement
            const storedTheme = localStorage.getItem("theme")
            // Default to light theme for clean, high-contrast readability
            const activeDark = storedTheme === "dark"

            if (activeDark) {
                root.classList.add("dark")
                setIsDark(true)
            } else {
                root.classList.remove("dark")
                setIsDark(false)
            }
        })
    }, [])

    const toggleTheme = () => {
        const root = window.document.documentElement
        if (isDark) {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
            setIsDark(false)
        } else {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
            setIsDark(true)
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-muted/80 hover:bg-muted transition-all text-foreground hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Toggle theme"
            type="button"
        >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
        </button>
    )
}
