import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dev Blog",
    template: "%s | Dev Blog",
  },
  description: "Next.js와 MDX로 작성하는 개인 기술 블로그",
  keywords: ["Next.js", "React", "TypeScript", "MDX", "Blog"],
  authors: [{ name: "Dev Blog" }],
  creator: "Dev Blog",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Dev Blog",
    title: "Dev Blog",
    description: "Next.js와 MDX로 작성하는 개인 기술 블로그",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Blog",
    description: "Next.js와 MDX로 작성하는 개인 기술 블로그",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
