import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const [
    { count: notas },
    { count: bendiciones },
    { count: pendientes },
    { count: libros },
  ] = await Promise.all([
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('blessings').select('*', { count: 'exact', head: true }),
    supabase.from('blessings').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('books').select('*', { count: 'exact', head: true }).eq('published', true),
  ])

  const stats = [
    { label: 'Notas publicadas',       value: notas ?? 0,       href: '/admin/notas' },
    { label: 'Bendiciones',            value: bendiciones ?? 0, href: '/admin/bendiciones' },
    { label: 'Pendientes de revisión', value: pendientes ?? 0,  href: '/admin/bendiciones', alert: (pendientes ?? 0) > 0 },
    { label: 'Libros en biblioteca',   value: libros ?? 0,      href: '/admin/biblioteca' },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl font-light text-stone-800 mb-1">Bienvenida</h1>
      <p className="text-sm text-stone-400 mb-10">¿Qué quieres cultivar hoy?</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-white border border-stone-100 rounded-xl p-5 hover:shadow-sm transition-all">
            <p className={`text-3xl font-light mb-1 ${s.alert ? 'text-amber-600' : 'text-stone-800'}`}>{s.value}</p>
            <p className="text-xs text-stone-400">{s.label}</p>
            {s.alert && <p className="text-xs text-amber-500 mt-1">· Requieren revisión</p>}
          </Link>
        ))}
      </div>

      <p className="text-eyebrow mb-4">Acciones rápidas</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/reflexion"   className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>+ Reflexión de hoy</Link>
        <Link href="/admin/notas"       className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>+ Nueva nota</Link>
        <Link href="/admin/bendiciones" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>Revisar bendiciones</Link>
      </div>
    </div>
  )
}
