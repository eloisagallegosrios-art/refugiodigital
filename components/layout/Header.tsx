'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/reflexion',   label: 'Reflexión' },
  { href: '/notas',       label: 'Notas' },
  { href: '/cuando',      label: 'Cuando necesito…' },
  { href: '/biblioteca',  label: 'Biblioteca' },
  { href: '/bendiciones', label: 'Bendiciones' },
]

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const textColor = transparent
    ? 'text-cream-DEFAULT/80 hover:text-white'
    : 'text-stone-500 hover:text-stone-800'

  const logoColor = transparent ? 'text-white' : 'text-stone-700'
  const borderColor = transparent ? 'border-white/10' : 'border-stone-100'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-600',
          transparent
            ? 'bg-transparent'
            : 'bg-[#FAF7F0]/95 backdrop-blur-md border-b border-stone-100'
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link
            href="/"
            className={cn(
              'font-serif text-xl font-light tracking-wide transition-colors duration-300',
              logoColor
            )}
          >
            Volver
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-[0.65rem] tracking-[0.12em] uppercase transition-colors duration-300',
                  pathname.startsWith(href)
                    ? transparent ? 'text-white font-medium' : 'text-stone-800 font-medium'
                    : transparent ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-stone-700'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Buscar + menú mobile */}
          <div className="flex items-center gap-4">
            <Link
              href="/buscar"
              aria-label="Buscar"
              className={cn('transition-colors duration-300', transparent ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-stone-700')}
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="5.5"/><line x1="11.5" y1="11.5" x2="15" y2="15"/>
              </svg>
            </Link>

            <button
              className={cn('md:hidden transition-colors duration-300', transparent ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-stone-700')}
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              {open
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="3" x2="15" y2="15"/><line x1="15" y1="3" x2="3" y2="15"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="2" y1="5" x2="16" y2="5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13" x2="16" y2="13"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      {/* Menú mobile */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#1A1714]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8" onClick={() => setOpen(false)}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-serif text-3xl font-light text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
