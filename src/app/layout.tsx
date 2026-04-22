import type { Metadata } from "next";
import { ClientLayout } from "@/components/layout/client-layout";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

// Fallback system fonts for build environments without network access
const fontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif`;
const monoStack = `"Fira Code", "Courier New", monospace`;

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
      style={{
        "--font-geist-sans": fontStack,
        "--font-geist-mono": monoStack,
      } as React.CSSProperties}
      className="h-full antialiased"
      suppressHydrationWarning // Used by next-themes
    >
      <body className="min-h-full flex flex-col">
        <LoadingProvider>
          <ClientLayout>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ClientLayout>
        </LoadingProvider>
      </body>
    </html>
  );
}
