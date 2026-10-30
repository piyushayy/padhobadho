import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full bg-background">
            {/* Optional floating brand (does NOT affect layout) */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    href="/"
                    className="text-2xl font-serif font-black text-primary"
                >
                    padhobadho
                </Link>
            </div>

            {/* Auth pages control their own layout */}
            {children}
        </div>
    )
}
