import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import ToasterProvider from "@/providers/toaster-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "padhobadho | Precision Exam Preparation Ecosystem",
    template: "%s | padhobadho"
  },
  description: "The premium AI-driven platform for CAT, GATE, NDA, and CUET aspirants. Practice with precision, track your mastery, and conquer your career goals with luxury engineering.",
  keywords: ["CAT 2026", "GATE Prep", "NDA Exam", "CUET 2026", "Competitive Exam Practice", "Mock Tests", "Study Material", "Elite Education"],
  authors: [{ name: "padhobadho Team" }],
  creator: "padhobadho",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://padhobadho.com",
    title: "padhobadho | Excellence in Exam Preparation",
    description: "Personalized AI-powered practice for CAT, GATE, NDA, and CUET. Join the Elite.",
    siteName: "padhobadho",
  },
  twitter: {
    card: "summary_large_image",
    title: "padhobadho | Excellence in Exam Preparation",
    description: "Personalized AI-powered practice for tier-1 competitive exams.",
    creator: "@padhobadho",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://padhobadho.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <AuthProvider>
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
