import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Kanban Board",
  description: "글로벌널리지 ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
          <main className="row-start-2 flex flex-col gap-8 items-center sm:items-start w-full min-h-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
