import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatShortDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reflexión del día' }
export const revalidate = 3600

export default async function ReflexionPage() {
  const supabase = await createClient()
  const today    = new Date().toISOString().split('T')[0]

  const { data: hoy } = await supabase
    .from('daily_reflections').select('*')
    .eq('reflection_date', today).maybeSingle()

  const { data: pasadas } = await supabase
    .from('daily_reflections').select('*')
    .neq('reflection_date', today)
    .order('reflection_date', { ascending: false }).limit(20)

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-6 py-20">

        <p className="text-eyebrow mb-10">{formatDate(today)}</p>

        {hoy ? (
          <article className="mb-20">
            <div className="divider-gold mb-10" />
            <blockquote className="font-serif text-3xl md:text-4xl font-light text-stone-700 italic leading-relaxed mb-8 text-balance">
              "{hoy.content}"
            </blockquote>
            {hoy.source && (
              <cite className="text-sm text-stone-400 not-italic">— {hoy.source}</cite>
            )}
          </article>
        ) : (
          <div className="py-20 text-center mb-20">
            <p className="font-serif text-2xl text-stone-400 italic">La reflexión de hoy llegará pronto.</p>
          </div>
        )}

        {/* Historial */}
        {(pasadas ?? []).length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="divider-gold" />
              <p className="text-eyebrow whitespace-nowrap">Reflexiones anteriores</p>
            </div>
            <div className="space-y-0">
              {(pasadas ?? []).map((r, i) => (
                <div key={r.id} className={`py-8 ${i < (pasadas?.length ?? 0) - 1 ? 'border-b border-stone-100' : ''}`}>
                  <p className="text-eyebrow mb-4">{formatShortDate(r.reflection_date)}</p>
                  <p className="font-serif text-xl font-light text-stone-600 italic leading-relaxed">"{r.content}"</p>
                  {r.source && <p className="text-xs text-stone-400 mt-3">— {r.source}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  )
}
