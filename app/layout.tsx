import { Navbar } from "@/components";
import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Head from 'next/head';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
})

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
  userScalable: 0,
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
        {/* <meta name="theme-color" content="#fff"/> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no " />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={inter.className}>
        <Navbar className={bebasNeue.className} />
        <main>{children}</main>
      </body>
    </html>
  );
}
