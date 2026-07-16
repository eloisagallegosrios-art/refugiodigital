import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatShortDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Buscar' }

interface Props { searchParams: Promise<{ q?: string; tag?: string }> }

interface NoteResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
  published: boolean
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q, tag } = await searchParams
  const supabase   = await createClient()
  let notes: NoteResult[] = []

  if (q && q.trim().length >= 2) {
    const { data } = await supabase
      .from('notes')
      .select('id,title,slug,excerpt,published_at,published')
      .eq('published', true)
      .or(`title.ilike.%${q}%,body.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .limit(20)
    notes = (data ?? []) as NoteResult[]
  } else if (tag) {
    const { data: t } = await supabase.from('tags').select('id').eq('slug', tag).maybeSingle()
    if (t) {
      const { data } = await supabase
        .from('notes')
        .select('id,title,slug,excerpt,published_at,published')
        .eq('published', true)
        .in('id',
          ((await supabase.from('note_tags').select('note_id').eq('tag_id', t.id)).data ?? [])
            .map((r: { note_id: string }) => r.note_id)
        )
        .limit(20)
      notes = (data ?? []) as NoteResult[]
    }
  }

  const hasSearch = !!(q || tag)

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-eyebrow mb-4">Buscar</p>
        <h1 className="text-section text-stone-800 mb-10 text-balance">
          Encuentra lo que necesitas
        </h1>
        <form method="GET" action="/buscar" role="search" className="mb-12">
          <div className="relative">
            <input
              type="search" name="q" defaultValue={q ?? ''}
              placeholder="Busca por palabra, emocion, tema..."
              autoComplete="off"
              className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors pr-14"
              aria-label="Buscar"
            />
            <button type="submit" aria-label="Buscar"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="7" cy="7" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/>
              </svg>
            </button>
          </div>
        </form>
        {hasSearch ? (
          notes.length > 0 ? (
            <div>
              <p className="text-eyebrow mb-6">
                {notes.length} resultado{notes.length !== 1 ? 's' : ''}{q ? ` para "${q}"` : ''}
              </p>
              {notes.map(n => (
                <Link key={n.id} href={`/notas/${n.slug}`}
                  className="group flex items-start gap-5 py-6 border-b border-stone-100 last:border-0 hover:opacity-60 transition-opacity block">
                  <div className="w-4 h-px bg-stone-200 mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-light text-stone-800 mb-1">{n.title}</h3>
                    {n.excerpt && <p className="text-sm text-stone-400 leading-relaxed mb-1">{n.excerpt}</p>}
                    {n.published_at && <p className="text-xs text-stone-300">{formatShortDate(n.published_at)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-serif text-xl text-stone-400 italic mb-3">No encontramos resultados.</p>
              <Link href="/notas" className="text-sm text-stone-400 underline">Ver todas las notas</Link>
            </div>
          )
        ) : (
          <div>
            <p className="text-eyebrow mb-4">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {['miedo', 'perdon', 'paz', 'ansiedad', 'amor', 'culpa', 'soltar', 'presencia'].map(term => (
                <Link key={term} href={`/buscar?q=${term}`}
                  className="text-sm text-stone-500 border border-stone-200 px-4 py-2 rounded-full hover:border-stone-400 hover:text-stone-700 transition-all">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
