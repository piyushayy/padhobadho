"use client"

import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const root = window.document.documentElement
        const initialColorValue = root.classList.contains("dark")
        setIsDark(initialColorValue)
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
            className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-all text-foreground"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    )
}
