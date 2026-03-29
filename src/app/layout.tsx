import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientLayout } from "@/components/layout/client-layout";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asep Haryana Saputra | Next.js",
  description: "Crafting robust Backend systems with high-performance Frontend solutions to build seamless digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // Used by next-themes
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
