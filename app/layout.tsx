import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RegisterSW from "@/components/RegisterSW";

import MobileNav from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: '--font-body' });

export const metadata: Metadata = {
  title: "CampusFind | AI Lost & Found",
  description: "AI-powered campus Lost & Found system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body bg-[#000000] text-white antialiased selection:bg-white selection:text-black`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
            {children}
            <RegisterSW />
          </main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
