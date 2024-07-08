import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components"; 
import "./globals.css"; 
import Head from 'next/head';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSC Logbook",
  description: "Coded by yours truly",
  manifest: "/manifest.json",
  authors: [
    { 
      name: "Jerson Caibog",
      url: "https://github.com/Jersoni",
    },
    {
      name: "Rhey Ranido",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/apple-touch-icon.png" },
    { rel: "icon", url: "icons/apple-touch-icon.png" },
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
        {/* <meta name="theme-color" content="#fff"/> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
