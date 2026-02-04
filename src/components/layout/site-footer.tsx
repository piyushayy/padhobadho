import Link from "next/link"

export function SiteFooter() {
    return (
        <footer className="border-t border-border/30 py-16 bg-accent/5">
            <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
                <div className="col-span-2">
                    <Link href="/" className="text-2xl font-serif font-black tracking-tight text-foreground flex items-center gap-2 mb-6">
                        padhobadho
                    </Link>
                    <p className="text-muted-foreground max-w-sm leading-relaxed">
                        A calm, focused learning platform for students preparing for competitive exams like CUET. Built for scores, ranks, and confidence.
                    </p>
                </div>

                <div>
                    <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-foreground">Platform</h4>
                    <ul className="space-y-4 text-muted-foreground font-medium">
                        <li><Link href="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
                        <li><Link href="/mock-test" className="hover:text-primary transition-colors">Mock Tests</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-foreground">Company</h4>
                    <ul className="space-y-4 text-muted-foreground font-medium">
                        <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-border/30 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                © {new Date().getFullYear()} padhobadho. Engineered with Heart.
            </div>
        </footer>
    )
}
