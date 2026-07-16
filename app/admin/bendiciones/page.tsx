import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { formatDate } from '@/lib/utils'

async function approve(fd: FormData) {
  'use server'
  await (await createClient()).from('blessings').update({ approved: true }).eq('id', fd.get('id') as string)
  revalidatePath('/admin/bendiciones'); revalidatePath('/bendiciones')
}
async function reject(fd: FormData) {
  'use server'
  await (await createClient()).from('blessings').delete().eq('id', fd.get('id') as string)
  revalidatePath('/admin/bendiciones'); revalidatePath('/bendiciones')
}

export default async function AdminBendicionesPage() {
  const supabase = await createClient()
  const { data: pendientes } = await supabase.from('blessings').select('*').eq('approved', false).order('created_at', { ascending: true })
  const { data: aprobadas }  = await supabase.from('blessings').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(30)

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-light text-stone-800 mb-2">Bendiciones</h1>
      <p className="text-sm text-stone-400 mb-10">Revisa y aprueba las bendiciones antes de publicarlas.</p>

      <section className="mb-12">
        <p className="text-eyebrow mb-5">Pendientes {(pendientes ?? []).length > 0 && `· ${pendientes!.length}`}</p>
        {(pendientes ?? []).length === 0 ? (
          <p className="text-sm text-stone-400 italic">No hay bendiciones pendientes. ✓</p>
        ) : (
          <div className="space-y-3">
            {(pendientes ?? []).map(b => (
              <div key={b.id} className="bg-white border border-stone-100 rounded-xl p-5">
                <p className="font-serif text-base text-stone-700 mb-3 leading-relaxed">{b.content}</p>
                <div className="flex items-center justify-between">
                  <time className="text-xs text-stone-300">{formatDate(b.created_at)}</time>
                  <div className="flex gap-2">
                    <form action={reject}><input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="text-xs text-rose-400 border border-rose-200 px-4 py-1.5 rounded hover:bg-rose-50 transition-all">Rechazar</button>
                    </form>
                    <form action={approve}><input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="text-xs text-stone-600 border border-stone-300 px-4 py-1.5 rounded hover:bg-stone-50 transition-all">Aprobar</button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="text-eyebrow mb-5">Publicadas recientemente</p>
        <div className="space-y-0">
          {(aprobadas ?? []).map(b => (
            <div key={b.id} className="flex items-start justify-between py-4 border-b border-stone-100 last:border-0 gap-4">
              <p className="font-serif text-sm text-stone-600 leading-relaxed flex-1">{b.content}</p>
              <form action={reject}><input type="hidden" name="id" value={b.id} />
                <button type="submit" className="text-xs text-stone-300 hover:text-rose-400 transition-colors flex-shrink-0">×</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
