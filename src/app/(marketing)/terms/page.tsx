import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="text-5xl font-serif font-black mb-8">Terms of Service</h1>
                <div className="prose prose-lg dark:prose-invert space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">1. Platform Usage</h2>
                        <p>
                            By accessing padhobadho, you agree to use the platform for personal, non-commercial educational purposes.
                            Unauthorized scraping or reproduction of our question bank is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">2. Elite Membership</h2>
                        <p>
                            Elite upgrades provide full access to mock tests and advanced analytics. Subscriptions are per-user
                            and are not transferable. Refund requests are subject to our standard 7-day review policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">3. User Conduct</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account. Any attempt to exploit or
                            manipulate our global leaderboard rankings will result in permanent account suspension.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">4. Content Accuracy</h2>
                        <p>
                            While we strive for 100% accuracy in our explanations and simulations, padhobadho is a preparation
                            assistant and does not guarantee specific exam results.
                        </p>
                    </section>

                    <p className="pt-8 text-sm italic">
                        By using this platform, you agree to these terms. Last updated: January 2026.
                    </p>
                </div>
            </main>
        </div>
    );
}
