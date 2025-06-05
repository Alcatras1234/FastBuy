import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "FastBuy - Ticket Booking",
  description: "Book tickets for sports events",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={notoSans.className}>
      <body>{children}</body>
    </html>
  )
}
