import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="h-20 border-b flex items-center px-6 glass sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif font-black text-primary">padhobadho</Link>
            </header>
            <main className="container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="text-5xl font-serif font-black mb-8">About Us</h1>
                <div className="prose prose-lg dark:prose-invert space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Welcome to <strong>padhobadho</strong>, India's most focused competitive exam preparation ecosystem.
                        Whether you are targeting <strong>CAT, GATE, NDA, CUET</strong>, or <strong>CLAT</strong>, we provide a precision-engineered environment for your success.
                    </p>
                    <p>
                        We started with a simple observation: most exam preparation tools are cluttered, stressful,
                        and filled with unnecessary coaching-style marketing.
                    </p>
                    <p>
                        We believe that preparation should be calm, methodical, and data-driven. Our platform
                        uses a "Learning by Doing" approach, focusing on smart practice sessions rather than
                        passive video watching.
                    </p>
                    <h2 className="text-2xl font-serif font-bold text-foreground pt-8">Our Philosophy</h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li><strong>Minimalism:</strong> No banners, no distractions, no unnecessary notifications. Just you and your goal.</li>
                        <li><strong>Accuracy:</strong> Exam-accurate question patterns and difficulty levels for every track.</li>
                        <li><strong>Accessibility:</strong> High-quality preparation for every aspirant reaching for premier institutions.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
