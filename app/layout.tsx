import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { AgeVerificationProvider } from '@/lib/age-verification-context'

export const metadata: Metadata = {
  title: 'STEEZ - Álcool sem culpa',
  description: 'STEEZ - A bebida para quem se preocupa com o corpo mas não abdica da diversão',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AgeVerificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AgeVerificationProvider>
      </body>
    </html>
  )
}
