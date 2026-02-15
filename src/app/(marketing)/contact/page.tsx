import Link from "next/link";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { DonationSection } from "@/components/donation-section";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <main className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight">Let's Connect.</h1>
                    <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">Have questions? We're here to help you navigate your journey to success.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Email Us</h3>
                                    <p className="text-muted-foreground font-medium">Our support team typically responds within 4 hours.</p>
                                    <a href="mailto:piyushkaushik121@gmail.com" className="text-primary font-black text-lg hover:underline">piyushkaushik121@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Community</h3>
                                    <p className="text-muted-foreground font-medium">Join our global network of aspirants.</p>
                                    <a href="https://discord.gg/padhobadho" target="_blank" className="text-primary font-black text-lg hover:underline">discord.gg/padhobadho</a>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
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

                    <div className="brilliant-card bg-card p-8 md:p-10 border border-border/40 shadow-2xl relative overflow-hidden rounded-3xl">
                        <ContactForm />
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                    </div>
                </div>
            </main>

            <DonationSection />
        </div>
    );
}
