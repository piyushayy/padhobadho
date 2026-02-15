import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DollarSign, Copy, CheckCircle } from "lucide-react"
import { FeedbackManager } from "./feedback-manager"
import { PageHeader } from "@/components/page-header"

export default async function AdminDonationsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Donations & Support"
                subtitle="Overview of financial contributions."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Card */}
                <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Manual Verification Required</h2>
                        <p className="text-muted-foreground">
                            This platform currently uses direct UPI transfers for donations.
                            There is no automated payment gateway or database record for these transactions.
                        </p>
                    </div>

                    <div className="bg-muted p-4 rounded-xl space-y-2">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Active UPI ID</p>
                        <div className="flex items-center gap-2 font-mono font-bold text-lg select-all">
                            9205608772@ybl
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="font-bold">How to Verify:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                Check your bank statement or UPI app for incoming transfers.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                Cross-reference with user email if they contacted you manually.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Information Card */}
                <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <DollarSign size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-xl">Automated Tracking Coming Soon</h3>
                    <p className="text-muted-foreground max-w-xs">
                        Future updates will include Razorpay/Stripe integration for automated donation tracking and receipts.
                    </p>
                </div>
            </div>
        </div>
    )
}
