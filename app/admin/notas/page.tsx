import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { formatShortDate, slugify } from '@/lib/utils'

async function createNote(fd: FormData) {
  'use server'
  const title     = (fd.get('title') as string).trim()
  const body      = (fd.get('body') as string).trim()
  const excerpt   = (fd.get('excerpt') as string).trim()
  const published = fd.get('published') === 'on'
  if (!title || !body) return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notes').insert({
    title, slug: slugify(title), body,
    excerpt: excerpt || null, published,
    published_at: published ? new Date().toISOString() : null,
    author_id: user.id,
  })
  revalidatePath('/admin/notas'); revalidatePath('/notas'); revalidatePath('/')
}

async function toggleNote(fd: FormData) {
  'use server'
  const id  = fd.get('id') as string
  const pub = fd.get('published') === 'true'
  const supabase = await createClient()
  await supabase.from('notes').update({ published: !pub, published_at: !pub ? new Date().toISOString() : null }).eq('id', id)
  revalidatePath('/admin/notas'); revalidatePath('/notas'); revalidatePath('/')
}

async function deleteNote(fd: FormData) {
  'use server'
  await (await createClient()).from('notes').delete().eq('id', fd.get('id') as string)
  revalidatePath('/admin/notas'); revalidatePath('/notas')
}

export default async function AdminNotasPage() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select('id,title,slug,excerpt,published,published_at').order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl font-light text-stone-800 mb-2">Notas</h1>
      <p className="text-sm text-stone-400 mb-10">Escribe y publica las notas de consciencia.</p>

      <details className="mb-10">
        <summary className="cursor-pointer btn-secondary inline-block mb-5 list-none" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>
          + Nueva nota
        </summary>
        <form action={createNote} className="bg-white border border-stone-100 rounded-xl p-6 mt-4 space-y-5">
          <div>
            <label className="text-eyebrow block mb-2">Título</label>
            <input name="title" required placeholder="El título de la nota…" className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Extracto <span className="text-stone-300 normal-case font-normal">(resumen breve)</span></label>
            <input name="excerpt" placeholder="Una línea que invite a leer…" className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Texto</label>
            <textarea name="body" required rows={12} placeholder="Escribe la nota aquí.&#10;&#10;Separa los párrafos con una línea en blanco.&#10;&#10;Para citas, comienza la línea con comillas."
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm font-serif leading-relaxed resize-y focus:outline-none focus:border-stone-400 transition-colors placeholder:text-stone-300" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" className="rounded border-stone-300" />
              <span className="text-sm text-stone-600">Publicar ahora</span>
            </label>
            <button type="submit" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>Guardar</button>
          </div>
        </form>
      </details>

      <p className="text-eyebrow mb-5">{(notes ?? []).length} notas</p>
      <div className="space-y-3">
        {(notes ?? []).map(n => (
          <div key={n.id} className="bg-white border border-stone-100 rounded-xl p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-serif text-base text-stone-800 truncate">{n.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 border ${n.published ? 'text-stone-500 border-stone-200' : 'text-stone-300 border-stone-100'}`}>
                  {n.published ? 'publicada' : 'borrador'}
                </span>
              </div>
              {n.excerpt && <p className="text-xs text-stone-400 truncate">{n.excerpt}</p>}
              {n.published_at && <p className="text-xs text-stone-300 mt-1">{formatShortDate(n.published_at)}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {n.published && <Link href={`/notas/${n.slug}`} target="_blank" className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-2 py-1">Ver →</Link>}
              <form action={toggleNote}>
                <input type="hidden" name="id" value={n.id} /><input type="hidden" name="published" value={String(n.published)} />
                <button type="submit" className="text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded hover:bg-stone-50 transition-all">
                  {n.published ? 'Despublicar' : 'Publicar'}
                </button>
              </form>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={n.id} />
                <button type="submit" className="text-xs text-stone-300 hover:text-rose-400 transition-colors px-2 py-1">×</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
