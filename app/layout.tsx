import { Navbar } from "@/components";
import { AppWrapper } from "@/context";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Head from 'next/head';
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["100" , "200" , "300" , "400" , "500" , "600" , "700" , "800" , "900"]
});
// const bebasNeue = localFont({ src: '../public/fonts/BebasNeue-Regular.ttf' })

export const metadata: Metadata = {
  title: "Presenxia",
  applicationName: 'Presenxia',
  creator: 'Jerson Caibog',
  authors: [{ name: "Jerson Caibog", url: "https://github.com/Jersoni", }, ],
  description: "Presenxia is a user-friendly attendance management system for schools and events, designed to efficiently track and record attendance with real-time updates and detailed reporting. Easily create, manage, and monitor event participation in just a few clicks.",
  keywords: "presenxia, attendance, event management, school events, real-time updates, tracking, seminar attendance, seminar tracking, student events" ,
  generator: 'Next.js',
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: [
    { rel: "apple-touch-icon", url: "icons/apple-touch-icon.png" },
    { rel: "icon", url: "icons/apple-touch-icon.png" },
  ],
  openGraph: {
    title: 'Presenxia | Efficient Attendance Management',
  },

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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no " />
        
        <link  rel="apple-touch-icon" href="/apple-touch-icon.png" type="image/png" />
        <link  rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link  rel="icon" href="/favicon.ico" sizes="any" />

        <meta name="theme-color" content="black" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </Head>
      
      <body 
        className={inter.className}
      >
        <AppRouterCacheProvider>
          <NextTopLoader 
            color="#0ea5e9 "
            showSpinner={false}
            shadow={false}
          />
          <AppWrapper>
            <Navbar 
              // className={bebasNeue.className} 
            />
            <main>{children}</main>
          </AppWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
