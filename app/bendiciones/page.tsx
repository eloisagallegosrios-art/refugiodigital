import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import BlessingForm from '@/components/ui/BlessingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Muro de bendiciones' }
export const revalidate = 300

export default async function BendicionesPage() {
  const supabase = await createClient()
  const { data: blessings } = await supabase
    .from('blessings').select('*')
    .eq('approved', true).order('created_at', { ascending: false }).limit(60)

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-6 py-20">

        <p className="text-eyebrow mb-4">Muro de bendiciones</p>
        <h1 className="text-section text-stone-800 mb-4 text-balance">
          Lo que el corazón<br /><em className="italic font-light text-stone-500">necesita soltar</em>
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed mb-14 max-w-sm">
          Escribe de forma anónima. Sin respuestas. Sin likes. Sin perfiles.<br />
          Solo palabras que sanan cuando las dices.
        </p>

        <BlessingForm />

        <div className="flex items-center gap-4 my-16">
          <div className="flex-1 h-px bg-stone-100" />
          <div className="divider-gold" style={{ width: '3rem' }} />
          <div className="flex-1 h-px bg-stone-100" />
        </div>

        {(blessings ?? []).length > 0 ? (
          <div className="space-y-0" role="feed" aria-label="Bendiciones">
            {(blessings ?? []).map(b => (
              <article key={b.id} className="py-8 border-b border-stone-100 last:border-0">
                <p className="font-serif text-xl font-light text-stone-700 leading-relaxed mb-2">{b.content}</p>
                <time dateTime={b.created_at} className="text-xs text-stone-300">{formatDate(b.created_at)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-stone-400 italic">Sé el primero en escribir una bendición.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
