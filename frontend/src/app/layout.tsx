import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Steel Faults Classifier",
  description: "AI-Powered Defect Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-appBg text-textPrimary`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-[1400px] mx-auto w-full p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
