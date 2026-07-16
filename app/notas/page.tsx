import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatShortDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notas de consciencia',
  description: 'Reflexiones escritas desde la presencia.',
}
export const revalidate = 3600

const FALLBACK_COLORS = ['bg-[#E8D9C0]', 'bg-[#C5D4C0]', 'bg-[#D9C9A8]', 'bg-[#DDD5C8]', 'bg-[#C8D5D3]', 'bg-[#D5C8D5]']

export default async function NotasPage() {
  const supabase = await createClient()

  const { data: raw } = await supabase
    .from('notes')
    .select('id, title, slug, excerpt, published_at, cover_image_url')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const notes = raw ?? []
  const [featured, ...rest] = notes

  return (
    <SiteLayout>
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Cabecera */}
        <div className="mb-16">
          <p className="text-eyebrow mb-4">Notas de consciencia</p>
          <h1 className="text-section text-stone-800 text-balance max-w-lg">
            Palabras escritas<br /><em className="italic font-light text-stone-500">desde el centro</em>
          </h1>
        </div>

        {/* Nota destacada */}
        {featured && (
          <Link href={`/notas/${featured.slug}`} className="group block card mb-10 md:grid md:grid-cols-2 overflow-hidden">
            <div className="relative h-64 md:h-auto bg-stone-100">
              {featured.cover_image_url ? (
                <Image src={featured.cover_image_url} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-[#E8D9C0]" />
              )}
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {featured.published_at && <p className="text-eyebrow mb-4">{formatShortDate(featured.published_at)}</p>}
              <h2 className="font-serif text-3xl font-light text-stone-800 mb-4 group-hover:text-stone-600 transition-colors text-balance">
                {featured.title}
              </h2>
              {featured.excerpt && <p className="text-sm text-stone-400 leading-relaxed">{featured.excerpt}</p>}
              <p className="mt-6 text-[0.65rem] tracking-[0.12em] uppercase text-stone-400 group-hover:text-stone-600 transition-colors">
                Leer nota →
              </p>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((note, i) => (
              <Link key={note.id} href={`/notas/${note.slug}`} className="group card block">
                <div className={`relative h-44 ${note.cover_image_url ? 'bg-stone-100' : FALLBACK_COLORS[i % FALLBACK_COLORS.length]} overflow-hidden`}>
                  {note.cover_image_url && (
                    <Image src={note.cover_image_url} alt={note.title} fill className="object-cover transition-transform duration-600 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-6">
                  {note.published_at && <p className="text-eyebrow mb-3">{formatShortDate(note.published_at)}</p>}
                  <h3 className="font-serif text-xl font-light text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                    {note.title}
                  </h3>
                  {note.excerpt && <p className="text-xs text-stone-400 leading-relaxed">{note.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {notes.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-stone-400 italic">Las notas llegarán pronto.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
