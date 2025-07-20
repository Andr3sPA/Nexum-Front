import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { headers } from 'next/headers';
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/organisms/toaster"
import { ToastProvider } from "@/hooks/use-toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexum",
  description: "Plataforma segura de gestión para egresados de la Universidad de Antioquia",
  keywords: ["Universidad de Antioquia", "UdeA", "Egresados", "Alumni", "Nexum"],
  authors: [{ name: "Universidad de Antioquia" }, { name: "Cristian Tamayo" }, { name: "Gerardo Castillo" }],
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta name="theme-color" content="#014926" />
        <meta name="csrf-token" content="" />
      </head>
      <body className={inter.className}>
        {/* Pass the nonce as a data attribute to make it available to client components */}
        <div id="root" data-nonce={nonce}>
          <Providers>
            <ToastProvider>
              <Toaster />
              {children}
            </ToastProvider>
          </Providers>
        </div>
      </body>
    </html>
  )
}
