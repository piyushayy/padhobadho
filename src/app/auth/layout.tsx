import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-8">
            <Link href="/" className="text-3xl font-serif font-bold text-primary mb-8">
                padhobadho
            </Link>
            <div className="w-full max-w-md bg-card rounded-3xl border shadow-sm p-8">
                {children}
            </div>
        </div>
    );
}
