import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { EMOTIONS } from '@/lib/emotions'
import type { Metadata } from 'next'

interface Props { params: Promise<{ emotion: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { emotion } = await params
  const found = EMOTIONS.find(e => e.id === emotion)
  return { title: found?.label ?? 'Cuando necesito…' }
}

export async function generateStaticParams() {
  return EMOTIONS.map(e => ({ emotion: e.id }))
}

export const revalidate = 3600

export default async function EmotionPage({ params }: Props) {
  const { emotion } = await params
  const def = EMOTIONS.find(e => e.id === emotion)
  if (!def) notFound()

  const supabase = await createClient()

  const { data: ec } = await supabase
    .from('emotion_content').select('*')
    .eq('emotion', emotion).order('sort_order', { ascending: true })

  const noteIds       = ec?.filter(x => x.content_type === 'note').map(x => x.content_id) ?? []
  const reflectionIds = ec?.filter(x => x.content_type === 'reflection').map(x => x.content_id) ?? []

  const { data: notesRaw } = noteIds.length > 0
    ? await supabase.from('notes').select('id,title,slug,excerpt,published_at').eq('published', true).in('id', noteIds)
    : { data: [] }

  const { data: refs } = reflectionIds.length > 0
    ? await supabase.from('daily_reflections').select('id,content,source').in('id', reflectionIds)
    : { data: [] }

  const notes = notesRaw ?? []
  const hasContent = notes.length > 0 || (refs ?? []).length > 0

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-6 py-20">

        <Link href="/cuando" className="text-eyebrow hover:text-stone-600 transition-colors mb-8 inline-block">← Volver</Link>

        <p className="text-eyebrow mt-2 mb-4">Cuando sientes</p>
        <h1 className="text-section text-stone-800 mb-4">{def.label}</h1>
        <p className="text-sm text-stone-400 mb-2">{def.description}</p>
        <div className="divider-gold mt-8 mb-14" />

        {hasContent ? (
          <div className="space-y-14">
            {notes.length > 0 && (
              <section>
                <p className="text-eyebrow mb-6">Notas para este momento</p>
                {notes.map(n => (
                  <Link key={n.id} href={`/notas/${n.slug}`}
                    className="group flex items-start gap-5 py-6 border-b border-stone-100 last:border-0 hover:opacity-60 transition-opacity block">
                    <div className="w-4 h-px bg-stone-200 mt-3 flex-shrink-0 group-hover:bg-stone-500 transition-colors" />
                    <div>
                      <h3 className="font-serif text-xl font-light text-stone-800 mb-1">{n.title}</h3>
                      {n.excerpt && <p className="text-sm text-stone-400 leading-relaxed">{n.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </section>
            )}
            {(refs ?? []).length > 0 && (
              <section>
                <p className="text-eyebrow mb-6">Palabras que pueden ayudar</p>
                {(refs ?? []).map(r => (
                  <blockquote key={r.id} className="border-l-2 border-[#E8D48A] pl-6 py-1 mb-6">
                    <p className="font-serif text-xl font-light text-stone-700 italic leading-relaxed mb-2">"{r.content}"</p>
                    {r.source && <cite className="text-xs text-stone-400 not-italic">— {r.source}</cite>}
                  </blockquote>
                ))}
              </section>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-xl text-stone-400 italic mb-4">Pronto habrá contenido aquí.</p>
            <Link href="/notas" className="text-sm text-stone-400 underline hover:text-stone-600 transition-colors">
              Explorar todas las notas →
            </Link>
          </div>
        )}

        {/* Otras emociones */}
        <div className="mt-20 pt-12 border-t border-stone-100">
          <p className="text-eyebrow mb-6">¿Sientes algo diferente?</p>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONS.filter(e => e.id !== emotion).map(e => (
              <Link key={e.id} href={`/cuando/${e.id}`}
                className="card-cream px-5 py-4 rounded-xl border border-stone-100 hover:bg-white hover:shadow-sm transition-all block">
                <p className="font-serif text-base text-stone-700">{e.label}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </SiteLayout>
  )
}
