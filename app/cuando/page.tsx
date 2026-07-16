import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { EMOTIONS } from '@/lib/emotions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cuando necesito…' }

export default function CuandoPage() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">

        <p className="text-eyebrow mb-5">Un momento</p>
        <h1 className="text-section text-stone-800 mb-4 text-balance">
          ¿Cómo te sientes<br /><em className="italic font-light text-stone-500">ahora?</em>
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed mb-14 max-w-sm">
          No tienes que resolver nada. Solo elige lo que sientes
          y deja que el contenido te acompañe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EMOTIONS.map((e) => (
            <Link
              key={e.id}
              href={`/cuando/${e.id}`}
              className="group card-cream px-7 py-6 hover:bg-white hover:shadow-sm transition-all duration-300 rounded-xl border border-stone-100 block"
            >
              <p className="font-serif text-xl font-light text-stone-800 mb-1 group-hover:text-stone-600 transition-colors">
                {e.label}
              </p>
              <p className="text-xs text-stone-400 leading-snug">{e.description}</p>
            </Link>
          ))}
        </div>

      </div>
    </SiteLayout>
  )
}
