import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import ToasterProvider from "@/providers/toaster-provider";
import TelemetryProvider from "@/components/telemetry-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "PadhoBadho | 100% Free Exam Prep for Class 12, JEE, NEET, CUET, SSC & DSSSB",
    template: "%s | PadhoBadho"
  },
  metadataBase: new URL('https://padhobadho.com'),
  description: "Padhega India, Badhega India. 100% free practice questions, NTA CBT mock tests, and curated PYQ vaults for Class 12 Boards, JEE, NEET, CUET, SSC & DSSSB.",
  keywords: ["Free Mock Tests", "Class 12 Boards", "JEE Main", "NEET-UG", "CUET 2026", "SSC CGL", "DSSSB", "PYQ Papers", "Free Practice", "PadhoBadho"],
  authors: [{ name: "PadhoBadho Team" }],
  creator: "PadhoBadho",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://padhobadho.com",
    title: "PadhoBadho | 100% Free Exam Prep for Class 12, JEE, NEET, CUET, SSC & DSSSB",
    description: "Padhega India, Badhega India. 100% free practice drills, official pattern mock tests, and past year question papers.",
    siteName: "PadhoBadho",
  },
  twitter: {
    card: "summary_large_image",
    title: "PadhoBadho | 100% Free Exam Prep",
    description: "100% free practice questions, CBT mock tests, and PYQs for all major Indian exams.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://padhobadho.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <AuthProvider>
          <ToasterProvider />
          <TelemetryProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
