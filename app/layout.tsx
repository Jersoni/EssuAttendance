import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components"; 
import "./globals.css"; 
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSC Attendance",
  description: "Coded by yours truly",
  manifest: "/manifest.json",
  authors: [
    { name: "Jerson Caibog & Rhey Ranido" },
    {
      name: "Jerson Caibog & Rhey Ranido",
      url: "https://github.com/Jersoni",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/quill-icon-128x128.png" },
    { rel: "icon", url: "icons/quill-icon-128x128.png" },
  ],
};

export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#045511"/>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
