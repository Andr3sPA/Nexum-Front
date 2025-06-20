import type React from "react"
import type { Metadata } from "next"
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
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#014926" />
        <meta name="csrf-token" content="" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
