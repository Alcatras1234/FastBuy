import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ClientHeader } from "./clientHeader";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
});


export const metadata: Metadata = {
  title: "FastBuy",
  description: "Предзаказ билетов на футбольные матчи",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${notoSans.variable} antialiased`}>
        <ClientHeader />
        <main className="min-h-screen">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}
