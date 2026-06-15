import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">

            {/* Main */}
            <main className="container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="text-5xl font-serif font-black mb-8">
                    About Us
                </h1>

                <div className="prose prose-lg dark:prose-invert space-y-8 text-muted-foreground leading-relaxed">

                    <p>
                        <strong>padhobadho</strong> is built for this generation — the one that’s tired of noisy coaching apps,
                        endless videos, fake motivation, and distraction everywhere.
                    </p>

                    <p>
                        We’re a <strong>practice-first exam prep platform</strong> designed mainly for <strong>Gen-Z students</strong>
                        preparing for competitive and college entrance exams like <strong>CUET</strong> and similar tests.
                        No drama. No fluff. Just focused preparation.
                    </p>

                    <p>
                        Let’s be real — cracking exams isn’t about watching more videos or collecting PDFs.
                        It’s about showing up daily, solving the right questions, and actually understanding where you stand.
                        That’s exactly what this platform is built for.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-foreground pt-8">
                        What We Focus On
                    </h2>

                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Smart Practice:</strong> Short, meaningful practice sessions instead of overwhelming content dumps.
                        </li>
                        <li>
                            <strong>Consistency over Cramming:</strong> We help you build a daily habit, not panic before exams.
                        </li>
                        <li>
                            <strong>Clean Experience:</strong> Minimal UI, zero distractions, no unnecessary noise.
                        </li>
                        <li>
                            <strong>Real Progress:</strong> Questions that actually match exam patterns and difficulty.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-serif font-bold text-foreground pt-8">
                        Built Different (On Purpose)
                    </h2>

                    <p>
                        Most platforms try to keep you scrolling.
                        We try to help you improve.
                    </p>

                    <p>
                        padhobadho is not a coaching replacement or a content marketplace.
                        It’s a calm space where practice feels intentional, progress is visible,
                        and preparation finally makes sense.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-foreground pt-8">
                        Your Privacy Matters
                    </h2>

                    <p>
                        We respect your privacy — seriously.
                    </p>

                    <p>
                        We don’t sell your data. We don’t spam you.
                        Your performance, progress, and activity stay yours.
                        Any data we collect exists only to improve your learning experience,
                        not to exploit it.
                    </p>

                    <p>
                        No creepy tracking. No unnecessary permissions.
                        Just preparation.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-foreground pt-8">
                        Our Goal
                    </h2>

                    <p>
                        The goal isn’t just to help you clear an exam.
                        It’s to help you build focus, discipline, and confidence —
                        skills that actually matter beyond the exam hall.
                    </p>

                    <p className="font-medium text-foreground">
                        If you’re serious about your future,
                        we’re serious about helping you prepare for it.
                    </p>

                </div>
            </main>
        </div>
    );
}
