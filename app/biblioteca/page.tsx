import Image from 'next/image'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Biblioteca' }
export const revalidate = 86400

export default async function BibliotecaPage() {
  const supabase = await createClient()
  const { data: books } = await supabase
    .from('books').select('*, book_quotes(*)')
    .eq('published', true).order('sort_order', { ascending: true })

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-eyebrow mb-4">Lecturas</p>
        <h1 className="text-section text-stone-800 mb-4 text-balance">
          Biblioteca<br /><em className="italic font-light text-stone-500">de paz</em>
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed mb-2 max-w-md">
          Libros que han acompañado el camino. No como dogma, sino como luz que cada quien usa a su manera.
        </p>
        <p className="text-xs text-stone-300 mb-14">No almacenamos los libros. Solo referencias y reflexiones propias.</p>

        {(books ?? []).length > 0 ? (
          <div className="space-y-6">
            {(books ?? []).map(book => (
              <article key={book.id} className="card p-7 flex gap-6">
                <div className="flex-shrink-0">
                  {book.cover_url ? (
                    <div className="relative w-20 h-28 rounded-lg overflow-hidden shadow-sm">
                      <Image src={book.cover_url} alt={`Portada de ${book.title}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-28 bg-[#E8D9C0] rounded-lg flex items-center justify-center text-2xl">📖</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-2xl font-light text-stone-800 mb-1">{book.title}</h3>
                  <p className="text-eyebrow mb-4">{book.author}</p>
                  {book.review && <p className="text-sm text-stone-500 leading-relaxed mb-5">{book.review}</p>}
                  {book.book_quotes?.[0] && (
                    <div className="border-l-2 border-[#E8D48A] pl-4">
                      <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">Cita favorita</p>
                      <p className="font-serif text-sm text-stone-600 italic leading-relaxed">"{book.book_quotes[0].quote_text}"</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-stone-400 italic">Los libros llegarán pronto.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
