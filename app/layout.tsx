import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { AgeVerificationProvider } from '@/lib/age-verification-context'
import { NotificationProvider } from '@/lib/notification-service'

export const metadata: Metadata = {
  title: 'STEEZ - Álcool sem culpa',
  description: 'STEEZ - A bebida para quem se preocupa com o corpo mas não abdica da diversão',
  keywords: ['Steez', 'Hard Seltzer', 'Pink', 'Bebida Alcóolica'],
  authors: [{ name: 'Steez' }],
  // Adicionar Open Graph para melhor compartilhamento em redes sociais
  openGraph: {
    title: 'STEEZ - Álcool sem culpa',
    description: 'A bebida para quem se preocupa com o corpo mas não abdica da diversão',
    images: ['/images/steez-pink-can.png'],
    type: 'website',
  },
}

// Definindo viewport para melhor responsividade
export const viewport: Viewport = {
  themeColor: '#F42254', // Cor do tema Rosa Steez
  width: 'device-width',
  initialScale: 1,
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
          <NotificationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationProvider>
        </AgeVerificationProvider>
      </body>
    </html>
  )
}
