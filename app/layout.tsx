import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { headers } from 'next/headers';
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UdeA Egresados - Universidad de Antioquia",
  description: "Plataforma segura de gestión para egresados de la Universidad de Antioquia",
  keywords: ["Universidad de Antioquia", "UdeA", "Egresados", "Alumni"],
  authors: [{ name: "Universidad de Antioquia" }],
  creator: "Universidad de Antioquia",
  publisher: "Universidad de Antioquia",
  robots: "index, follow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#014926",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the nonce from the headers (set by middleware)
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#014926" />
        <meta name="csrf-token" content="" />
      </head>
      <body className={inter.className}>
        {/* Pass the nonce as a data attribute to make it available to client components */}
        <div id="root" data-nonce={nonce}>{children}</div>
      </body>
    </html>
  )
}
