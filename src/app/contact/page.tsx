import Link from "next/link";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="h-20 border-b flex items-center px-6 glass sticky top-0 z-50">
                <Link href="/" className="text-2xl font-serif font-black text-primary">padhobadho</Link>
            </header>
            <main className="container mx-auto px-6 py-24 max-w-5xl">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight">Let's Connect.</h1>
                    <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">Have questions? We're here to help you navigate your journey to success.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Email Us</h3>
                                    <p className="text-muted-foreground font-medium">Our support team typically responds within 4 hours.</p>
                                    <p className="text-primary font-black text-lg">support@padhobadho.com</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Community</h3>
                                    <p className="text-muted-foreground font-medium">Join our global network of aspirants.</p>
                                    <p className="text-primary font-black text-lg">discord.gg/padhobadho</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Headquarters</h3>
                                    <p className="text-muted-foreground font-medium">The heart of academic engineering.</p>
                                    <p className="text-foreground font-black text-lg">New Delhi, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="brilliant-card bg-card p-10 border border-border/40 shadow-2xl relative overflow-hidden">
                        <form className="space-y-8 relative z-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <input type="text" className="w-full h-14 bg-background border border-border focus:border-primary rounded-xl px-4 font-bold outline-none transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <input type="email" className="w-full h-14 bg-background border border-border focus:border-primary rounded-xl px-4 font-bold outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message</label>
                                <textarea className="w-full h-40 bg-background border border-border focus:border-primary rounded-xl p-4 font-bold outline-none transition-all resize-none"></textarea>
                            </div>
                            <button className="h-16 w-full bg-primary text-background rounded-full font-black text-lg flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                <Send size={20} /> Dispatch Message
                            </button>
                        </form>
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full" />
                    </div>
                </div>
            </main>
        </div>
    );
}
