"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function TelemetryProvider() {
    useEffect(() => {
        // Global error & unhandled promise rejection handler
        const handleError = (event: ErrorEvent) => {
            if (process.env.NODE_ENV === "production") {
                // If Sentry DSN is configured, it sends to Sentry, otherwise safe console audit
                const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN
                if (sentryDsn && typeof window !== "undefined" && (window as any).Sentry) {
                    (window as any).Sentry.captureException(event.error || event.message)
                }
            }
        }

        const handleRejection = (event: PromiseRejectionEvent) => {
            if (process.env.NODE_ENV === "production") {
                const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN
                if (sentryDsn && typeof window !== "undefined" && (window as any).Sentry) {
                    (window as any).Sentry.captureException(event.reason)
                }
            }
        }

        window.addEventListener("error", handleError)
        window.addEventListener("unhandledrejection", handleRejection)

        return () => {
            window.removeEventListener("error", handleError)
            window.removeEventListener("unhandledrejection", handleRejection)
        }
    }, [])

    return (
        <>
            {/* Vercel Web Analytics & Speed Insights CDN script (runs only if deployed on Vercel or configured) */}
            <Script
                src="https://va.vercel-scripts.com/v1/script.js"
                strategy="lazyOnload"
                data-endpoint="/_vercel/insights"
            />
            <Script
                src="https://va.vercel-scripts.com/v1/speed-insights/script.js"
                strategy="lazyOnload"
                data-endpoint="/_vercel/speed-insights"
            />
        </>
    )
}
