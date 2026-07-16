'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BlessingForm() {
  const [content, setContent] = useState('')
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const remaining = 280 - content.length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (content.trim().length < 5) return
    setStatus('sending')
    try {
      const { error } = await createClient().from('blessings').insert({ content: content.trim(), approved: false })
      if (error) throw error
      setStatus('sent')
      setContent('')
      setTimeout(() => setStatus('idle'), 5000)
    } catch { setStatus('error') }
  }

  if (status === 'sent') {
    return (
      <div className="card-cream p-8 text-center rounded-xl border border-stone-100">
        <div className="divider-gold mx-auto mb-5" />
        <p className="font-serif text-xl text-stone-700 mb-2">Tu bendición fue enviada.</p>
        <p className="text-sm text-stone-400">Aparecerá en el muro cuando sea revisada.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-cream p-6 rounded-xl border border-stone-100 space-y-4">
      <p className="text-eyebrow">Escribe tu bendición</p>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Hoy bendigo a…"
        maxLength={280}
        rows={3}
        disabled={status === 'sending'}
        aria-label="Escribe tu bendición"
        className="w-full bg-transparent font-serif text-lg text-stone-700 placeholder:text-stone-300 resize-none focus:outline-none leading-relaxed"
      />
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <span className={`text-xs ${remaining < 40 ? 'text-amber-500' : 'text-stone-300'}`}>{remaining}</span>
        <button
          type="submit"
          disabled={content.trim().length < 5 || status === 'sending'}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: '0.5rem 1.5rem', fontSize: '0.65rem' }}
        >
          {status === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
      </div>
      {status === 'error' && <p className="text-xs text-rose-400">No se pudo enviar. Inténtalo de nuevo.</p>}
    </form>
  )
}
