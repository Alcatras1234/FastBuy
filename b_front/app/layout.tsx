import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClientHeader } from "./clientHeader";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});


export const metadata: Metadata = {
  title: "VoiceBuy",
  description: "Продажа озвучки для видео и аудио",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${nunito.variable} antialiased`}>
        <ClientHeader />
        <main className="min-h-screen">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}
