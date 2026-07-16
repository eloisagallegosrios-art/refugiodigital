import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatDate, readingTime } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

interface RelatedNote {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase  = await createClient()
  const { data }  = await supabase.from('notes').select('title, excerpt').eq('slug', slug).eq('published', true).maybeSingle()
  if (!data) return { title: 'Nota no encontrada' }
  return { title: data.title, description: data.excerpt ?? undefined }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from('notes').select('slug').eq('published', true)
  return (data ?? []).map(n => ({ slug: n.slug }))
}

export const revalidate = 3600

export default async function NotaPage({ params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: note } = await supabase
    .from('notes')
    .select('*, tags:note_tags(tag:tags(*))')
    .eq('slug', slug).eq('published', true).maybeSingle()

  if (!note) notFound()

  const tags   = (note.tags ?? []).map((t: { tag: unknown }) => t.tag).filter(Boolean) as Array<{ id: string; name: string; slug: string }>
  const tagIds = tags.map(t => t.id)

  let related: RelatedNote[] = []
  if (tagIds.length > 0) {
    const { data: noteIds } = await supabase
      .from('note_tags')
      .select('note_id')
      .in('tag_id', tagIds)
      .neq('note_id', note.id)

    const ids = (noteIds ?? []).map((r: { note_id: string }) => r.note_id)

    if (ids.length > 0) {
      const { data: relNotes } = await supabase
        .from('notes')
        .select('id,title,slug,excerpt,published')
        .eq('published', true)
        .in('id', ids)
        .limit(2)
      related = (relNotes ?? []) as RelatedNote[]
    }
  }

  return (
    <SiteLayout>
      <article className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {note.published_at && <time className="text-eyebrow">{formatDate(note.published_at)}</time>}
            <span className="text-stone-200">·</span>
            <span className="text-eyebrow">{readingTime(note.body)}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-800 leading-tight mb-6 text-balance">
            {note.title}
          </h1>
          {note.excerpt && (
            <p className="font-serif text-xl text-stone-500 italic leading-relaxed">{note.excerpt}</p>
          )}
          <div className="divider-gold mt-8" />
        </header>

        {note.cover_image_url && (
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-12 bg-stone-100">
            <Image src={note.cover_image_url} alt={note.title} fill className="object-cover" priority />
          </div>
        )}

        {note.audio_url && (
          <div className="mb-12 p-5 bg-[#F5EDE0] rounded-xl border border-stone-100">
            <p className="text-eyebrow mb-3">Escuchar nota</p>
            <audio controls className="w-full" style={{ accentColor: '#C9A84C' }}>
              <source src={note.audio_url} type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div className="prose-refugio">
          {note.body.split('\n\n').map((paragraph: string, i: number) => (
            paragraph.startsWith('"') ? (
              <blockquote key={i}>{paragraph}</blockquote>
            ) : (
              <p key={i}>{paragraph}</p>
            )
          ))}
        </div>

        {tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-stone-100 flex items-center gap-3 flex-wrap">
            <span className="text-eyebrow mr-1">Temas</span>
            {tags.map(t => (
              <Link key={t.id} href={`/buscar?tag=${t.slug}`}
                className="text-xs text-stone-400 border border-stone-200 px-3 py-1 rounded-full hover:border-stone-400 hover:text-stone-600 transition-colors">
                {t.name}
              </Link>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <aside className="mt-16 pt-12 border-t border-stone-100">
            <p className="text-eyebrow mb-6">También podría ayudarte</p>
            {related.map(n => (
              <Link key={n.id} href={`/notas/${n.slug}`}
                className="group flex items-start gap-4 py-5 border-b border-stone-100 last:border-0 hover:opacity-60 transition-opacity block">
                <div className="w-4 h-px bg-stone-200 mt-3 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-xl text-stone-700">{n.title}</h3>
                  {n.excerpt && <p className="text-sm text-stone-400 leading-relaxed mt-1">{n.excerpt}</p>}
                </div>
              </Link>
            ))}
          </aside>
        )}
      </article>
    </SiteLayout>
  )
}