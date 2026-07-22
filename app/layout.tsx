import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ALL Performance',
  description: 'Sistema de gestão de academia - ALL Performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
