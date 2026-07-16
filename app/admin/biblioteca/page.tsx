import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function createBook(fd: FormData) {
  'use server'
  const title = (fd.get('title') as string).trim(); const author = (fd.get('author') as string).trim()
  if (!title || !author) return
  const supabase = await createClient()
  const { data: book } = await supabase.from('books').insert({
    title, author,
    review:    (fd.get('review') as string).trim() || null,
    cover_url: (fd.get('cover_url') as string).trim() || null,
    published: fd.get('published') === 'on',
  }).select('id').single()
  const quote = (fd.get('quote') as string).trim()
  if (book && quote) await supabase.from('book_quotes').insert({ book_id: book.id, quote_text: quote })
  revalidatePath('/admin/biblioteca'); revalidatePath('/biblioteca')
}

async function toggleBook(fd: FormData) {
  'use server'
  const pub = fd.get('published') === 'true'
  await (await createClient()).from('books').update({ published: !pub }).eq('id', fd.get('id') as string)
  revalidatePath('/admin/biblioteca'); revalidatePath('/biblioteca')
}

async function deleteBook(fd: FormData) {
  'use server'
  await (await createClient()).from('books').delete().eq('id', fd.get('id') as string)
  revalidatePath('/admin/biblioteca'); revalidatePath('/biblioteca')
}

export default async function AdminBibliotecaPage() {
  const { data: books } = await (await createClient()).from('books').select('*, book_quotes(*)').order('sort_order')

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-light text-stone-800 mb-2">Biblioteca</h1>
      <p className="text-sm text-stone-400 mb-10">Agrega referencias de libros y citas favoritas.</p>

      <details className="mb-10">
        <summary className="cursor-pointer btn-secondary inline-block mb-5 list-none" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>+ Nuevo libro</summary>
        <form action={createBook} className="bg-white border border-stone-100 rounded-xl p-6 mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-eyebrow block mb-2">Título</label>
              <input name="title" required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
            </div>
            <div>
              <label className="text-eyebrow block mb-2">Autor</label>
              <input name="author" required className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-eyebrow block mb-2">URL de portada <span className="text-stone-300 normal-case font-normal">(opcional)</span></label>
            <input name="cover_url" type="url" placeholder="https://…" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Reseña personal</label>
            <textarea name="review" rows={3} className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm font-serif resize-none focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Cita favorita <span className="text-stone-300 normal-case font-normal">(opcional)</span></label>
            <textarea name="quote" rows={2} className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm font-serif italic resize-none focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" className="rounded border-stone-300" />
              <span className="text-sm text-stone-600">Publicar ahora</span>
            </label>
            <button type="submit" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>Guardar libro</button>
          </div>
        </form>
      </details>

      <p className="text-eyebrow mb-5">{(books ?? []).length} libros</p>
      <div className="space-y-3">
        {(books ?? []).map(b => (
          <div key={b.id} className="bg-white border border-stone-100 rounded-xl p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base text-stone-800">{b.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${b.published ? 'text-stone-500 border-stone-200' : 'text-stone-300 border-stone-100'}`}>
                  {b.published ? 'visible' : 'oculto'}
                </span>
              </div>
              <p className="text-xs text-stone-400">{b.author}</p>
            </div>
            <div className="flex gap-2">
              <form action={toggleBook}>
                <input type="hidden" name="id" value={b.id} /><input type="hidden" name="published" value={String(b.published)} />
                <button type="submit" className="text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded hover:bg-stone-50 transition-all">
                  {b.published ? 'Ocultar' : 'Publicar'}
                </button>
              </form>
              <form action={deleteBook}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" className="text-xs text-stone-300 hover:text-rose-400 transition-colors px-2 py-1">×</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
