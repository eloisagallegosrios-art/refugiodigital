'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos.'); setLoading(false); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-serif text-3xl font-light text-stone-700 mb-2">Volver</p>
          <p className="text-eyebrow">Panel de administración</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-eyebrow block mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2" htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full btn-secondary disabled:opacity-40" style={{ textAlign: 'center', display: 'block' }}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="text-center mt-8">
          <a href="/" className="text-xs text-stone-300 hover:text-stone-500 transition-colors">← Volver al sitio</a>
        </p>
      </div>
    </div>
  )
}
