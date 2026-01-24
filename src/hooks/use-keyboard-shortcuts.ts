"use client"

import { useEffect } from "react"

export function useKeyboardShortcuts(
    keyMap: { [key: string]: () => void },
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()

            // Check for modifier keys if needed in future (e.g. Ctrl+K)
            // For now, simple single keys

            if (keyMap[key]) {
                event.preventDefault()
                keyMap[key]()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [keyMap, enabled])
}
