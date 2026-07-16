import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Volver — Un refugio para la paz interior', template: '%s · Volver' },
  description: 'Un refugio digital para volver a la paz cuando sientes miedo, ansiedad o confusión.',
  openGraph: {
    title:       'Volver — Un refugio para la paz interior',
    description: 'Entra. Respira. Recuerda quién eres.',
    type:        'website',
    locale:      'es_MX',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
