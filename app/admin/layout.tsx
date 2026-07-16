import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const NAV = [
  { href: '/admin',             label: 'Dashboard',         icon: '◇' },
  { href: '/admin/reflexion',   label: 'Reflexión del día', icon: '◈' },
  { href: '/admin/notas',       label: 'Notas',             icon: '◉' },
  { href: '/admin/biblioteca',  label: 'Biblioteca',        icon: '◎' },
  { href: '/admin/bendiciones', label: 'Bendiciones',       icon: '◌' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-dvh bg-stone-50 flex">
      <aside className="w-56 bg-white border-r border-stone-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-100">
          <Link href="/" className="font-serif text-sm text-stone-500 hover:text-stone-800 transition-colors">← Al sitio</Link>
          <p className="text-eyebrow mt-3">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all">
              <span className="text-stone-300 text-xs">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-100">
          <p className="text-xs text-stone-400 truncate mb-1">{user.email}</p>
          <form action="/admin/logout" method="POST">
            <button type="submit" className="text-xs text-stone-300 hover:text-rose-400 transition-colors">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
