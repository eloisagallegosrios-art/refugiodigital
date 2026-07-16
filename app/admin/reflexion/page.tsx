import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { formatShortDate } from '@/lib/utils'

async function save(formData: FormData) {
  'use server'
  const content = (formData.get('content') as string).trim()
  const source  = (formData.get('source') as string).trim()
  const date    = formData.get('date') as string
  if (!content || !date) return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('daily_reflections').upsert(
    { content, source: source || null, reflection_date: date, created_by: user.id },
    { onConflict: 'reflection_date' }
  )
  revalidatePath('/admin/reflexion')
  revalidatePath('/reflexion')
  revalidatePath('/')
}

export default async function AdminReflexionPage() {
  const supabase = await createClient()
  const today    = new Date().toISOString().split('T')[0]
  const { data: hoy }     = await supabase.from('daily_reflections').select('*').eq('reflection_date', today).maybeSingle()
  const { data: historial } = await supabase.from('daily_reflections').select('*').order('reflection_date', { ascending: false }).limit(14)

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light text-stone-800 mb-2">Reflexión del día</h1>
      <p className="text-sm text-stone-400 mb-10">Una sola reflexión por día. Aparece en el inicio y en la página de reflexión.</p>

      <form action={save} className="bg-white border border-stone-100 rounded-xl p-6 mb-10 space-y-5">
        <div>
          <label className="text-eyebrow block mb-2" htmlFor="date">Fecha</label>
          <input type="date" id="date" name="date" defaultValue={today}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
        </div>
        <div>
          <label className="text-eyebrow block mb-2" htmlFor="content">Reflexión</label>
          <textarea id="content" name="content" defaultValue={hoy?.content ?? ''} rows={4}
            placeholder="Escribe la reflexión del día…"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm font-serif leading-relaxed resize-none focus:outline-none focus:border-stone-400 transition-colors placeholder:text-stone-300" />
        </div>
        <div>
          <label className="text-eyebrow block mb-2" htmlFor="source">Fuente <span className="text-stone-300 normal-case font-normal">(opcional)</span></label>
          <input type="text" id="source" name="source" defaultValue={hoy?.source ?? ''}
            placeholder="Un Curso de Milagros · Cap. 1"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 transition-colors placeholder:text-stone-300" />
        </div>
        <button type="submit" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>
          {hoy ? 'Actualizar' : 'Guardar'} reflexión
        </button>
      </form>

      <p className="text-eyebrow mb-5">Historial</p>
      <div className="space-y-0">
        {(historial ?? []).map(r => (
          <div key={r.id} className={`py-5 border-b border-stone-100 last:border-0 ${r.reflection_date === today ? 'opacity-40' : ''}`}>
            <p className="text-eyebrow mb-2">{formatShortDate(r.reflection_date)}</p>
            <p className="font-serif text-sm text-stone-600 italic leading-relaxed">"{r.content}"</p>
            {r.source && <p className="text-xs text-stone-400 mt-1">— {r.source}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
