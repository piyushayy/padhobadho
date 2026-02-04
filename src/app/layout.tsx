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
    default: "padhobadho | Master Your CUET Journey",
    template: "%s | padhobadho"
  },
  description: "The premium AI-driven platform for CUET aspirants. Personalized practice, smart analytics, and adaptive learning to secure your dream college.",
  keywords: ["CUET 2026", "CUET Prep", "Common University Entrance Test", "CUET Mock Tests", "CUET Practice", "Study Material", "College Admission"],
  authors: [{ name: "padhobadho Team" }],
  creator: "padhobadho",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://padhobadho.com",
    title: "padhobadho | Master Your CUET Journey",
    description: "Padhega India. Badhega India. Personalized AI-powered practice for CUET. Secure your dream college today.",
    siteName: "padhobadho",
  },
  twitter: {
    card: "summary_large_image",
    title: "padhobadho | Master Your CUET Journey",
    description: "Personalized AI-powered practice for CUET. Secure your dream college today.",
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
