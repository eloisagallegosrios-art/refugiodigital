import Header from './Header'
import Footer from './Footer'

export default function SiteLayout({
  children,
  transparentHeader = false,
}: {
  children: React.ReactNode
  transparentHeader?: boolean
}) {
  return (
    <>
      <Header transparent={transparentHeader} />
      <main className={transparentHeader ? '' : 'pt-16 min-h-dvh'}>
        {children}
      </main>
      <Footer />
    </>
  )
}
