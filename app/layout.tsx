import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"

import "@/app/globals.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const fontHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800", "900"],
})

export const metadata: Metadata = {
  title: "ARK Labs Research Peptides",
  description: "Research peptide storefront with product descriptions, research references, and laboratory-focused documentation.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontHeading.variable}`}>{children}</body>
    </html>
  )
}
