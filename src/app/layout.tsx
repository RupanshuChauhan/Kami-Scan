import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientWrapper from '../components/ClientWrapper'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Better font loading
});

export const metadata: Metadata = {
  title: "KamiScan - AI-Powered PDF Summarizer",
  description: "Transform your PDFs into intelligent summaries with zero-latency AI technology. Professional document processing made simple.",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
