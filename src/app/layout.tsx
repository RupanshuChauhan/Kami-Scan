import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientWrapper from '../components/ClientWrapper'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KamiScan - AI-Powered PDF Summarizer",
  description: "Transform your PDFs into intelligent summaries with zero-latency AI technology. Professional document processing made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
