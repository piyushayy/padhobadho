"use client"

import { Toaster } from "sonner"

export default function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            richColors
            expand
            closeButton
            duration={3000}
            toastOptions={{
                style: {
                    borderRadius: "1.25rem",
                    padding: "1rem 1.5rem",
                    fontWeight: "700",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-inter)",
                },
            }}
        />
    )
}
