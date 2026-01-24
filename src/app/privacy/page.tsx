import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="h-20 border-b flex items-center px-6 glass sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif font-black text-primary">padhobadho</Link>
            </header>
            <main className="container mx-auto px-6 py-24 max-w-3xl">
                <h1 className="text-5xl font-serif font-black mb-8">Privacy Policy</h1>
                <div className="prose prose-lg dark:prose-invert space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">1. Data Collection</h2>
                        <p>
                            We collect basic information required for your account, including your name, email, and academic preferences.
                            We also track your practice session data to provide personalized analytics and mastery scores.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">2. Use of Information</h2>
                        <p>
                            Your data is used solely to improve your learning experience. We do not sell your personal information to third-party
                            advertisers. Your analytics help our AI model recommend the right questions for your specific target exam.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">3. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data. Your password is encrypted using Bcrypt,
                            and our database access is strictly controlled.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">4. Cookies</h2>
                        <p>
                            We use essential cookies to maintain your login session. No tracking cookies or third-party marketing pixels are
                            used on this platform.
                        </p>
                    </section>

                    <p className="pt-8 text-sm italic">
                        Last updated: January 2026. For privacy concerns, please contact support@padhobadho.com.
                    </p>
                </div>
            </main>
        </div>
    );
}
