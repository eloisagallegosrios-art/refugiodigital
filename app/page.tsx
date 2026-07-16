import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { createClient } from '@/lib/supabase/server'
import { formatShortDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Volver — Un refugio para la paz interior',
}

export const revalidate = 3600

export default async function HomePage() {
  const supabase = await createClient()
  const today    = new Date().toISOString().split('T')[0]

  const { data: reflection } = await supabase
    .from('daily_reflections')
    .select('*')
    .eq('reflection_date', today)
    .maybeSingle()

  const { data: raw } = await supabase
    .from('notes')
    .select('id, title, slug, excerpt, published_at, cover_image_url')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const notes = raw ?? []

  return (
    <SiteLayout transparentHeader>

      {/* ── HERO con fotografía ─────────────────────────────── */}
      <section className="hero-photo">

        {/* Fotografía de fondo — imagen atmosférica cálida */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85"
            alt="Paisaje contemplativo al amanecer"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Overlay atmosférico */}
        <div className="hero-photo-overlay" />

        {/* Contenido del hero */}
        <div className="hero-photo-content w-full max-w-6xl mx-auto px-6 pb-16">
          <div className="max-w-2xl">

            <p className="text-eyebrow text-white/50 mb-6 anim-0">Un refugio para la paz interior</p>

            <h1 className="text-display text-white text-balance mb-8 anim-1">
              Volver<br />
              <span className="italic font-light text-white/70">a ti</span>
            </h1>

            <p className="font-serif text-xl text-white/60 leading-relaxed mb-12 max-w-md anim-2">
              Entra unos minutos.<br />
              Respira. Recuerda quién eres.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 anim-3">
              <Link href="/cuando" className="btn-primary">
                Cuando necesito…
              </Link>
              <Link
                href="/notas"
                className="font-sans text-[0.65rem] tracking-[0.12em] uppercase text-white/50 hover:text-white/80 transition-colors self-center"
              >
                Explorar notas →
              </Link>
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30" aria-hidden>
          <div className="w-px h-10 bg-white animate-[fadeIn_2s_1s_ease-out_forwards] opacity-0" style={{ animation: 'drift 2s ease-in-out infinite' }} />
        </div>

      </section>

      {/* ── REFLEXIÓN DEL DÍA ──────────────────────────────── */}
      {reflection && (
        <section className="bg-[#F5EDE0] py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="divider-gold mx-auto mb-8" />
            <p className="text-eyebrow mb-6">{formatShortDate(today)} · Reflexión de hoy</p>
            <blockquote className="font-serif text-2xl md:text-3xl font-light text-stone-700 italic leading-relaxed mb-6 text-balance">
              "{reflection.content}"
            </blockquote>
            {reflection.source && (
              <cite className="text-xs text-stone-400 not-italic tracking-wide">
                — {reflection.source}
              </cite>
            )}
            <div className="mt-8">
              <Link href="/reflexion" className="text-[0.65rem] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors">
                Ver reflexiones anteriores →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── MÓDULO CUANDO NECESITO ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texto */}
            <div>
              <p className="text-eyebrow mb-5">Un momento contigo</p>
              <h2 className="text-section text-stone-800 mb-6 text-balance">
                ¿Cómo te<br />
                <em className="italic font-light text-stone-500">sientes ahora?</em>
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed mb-10 max-w-sm">
                No tienes que resolver nada. Solo elige lo que sientes
                y el refugio te acompañará con contenido seleccionado.
              </p>
              <Link href="/cuando" className="btn-secondary">
                Entrar al espacio
              </Link>
            </div>

            {/* Emociones como tarjetas visuales */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tengo miedo',       icon: '◯' },
                { label: 'Estoy ansioso',      icon: '◯' },
                { label: 'Me siento solo',     icon: '◯' },
                { label: 'Necesito perdonar',  icon: '◯' },
                { label: 'Estoy enojado',      icon: '◯' },
                { label: 'Perdí la paz',       icon: '◯' },
              ].map(({ label }) => (
                <div
                  key={label}
                  className="card-cream px-5 py-4 cursor-default"
                >
                  <p className="font-serif text-base text-stone-700">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── NOTAS RECIENTES ────────────────────────────────── */}
      {notes.length > 0 && (
        <section className="bg-[#F5EDE0] py-24 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-eyebrow mb-3">Notas de consciencia</p>
                <h2 className="text-section text-stone-800">Palabras desde<br /><em className="italic font-light text-stone-500">el centro</em></h2>
              </div>
              <Link href="/notas" className="hidden md:block text-[0.65rem] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors">
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notes.map((note, i) => (
                <Link
                  key={note.id}
                  href={`/notas/${note.slug}`}
                  className="group card bg-white block"
                >
                  {/* Imagen o bloque de color */}
                  <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
                    {note.cover_image_url ? (
                      <Image
                        src={note.cover_image_url}
                        alt={note.title}
                        fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full ${i === 0 ? 'bg-[#E8D9C0]' : i === 1 ? 'bg-[#C5D4C0]' : 'bg-[#D9C9A8]'}`} />
                    )}
                  </div>
                  <div className="p-6">
                    {note.published_at && (
                      <p className="text-eyebrow mb-3">{formatShortDate(note.published_at)}</p>
                    )}
                    <h3 className="font-serif text-xl font-light text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                      {note.title}
                    </h3>
                    {note.excerpt && (
                      <p className="text-sm text-stone-400 leading-relaxed">{note.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/notas" className="btn-secondary">Ver todas las notas</Link>
            </div>

          </div>
        </section>
      )}

      {/* ── MURO DE BENDICIONES — invitación ───────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">

        {/* Fondo con segunda fotografía */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80"
            alt="Naturaleza serena"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1A1714]/65" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="divider-gold mx-auto mb-8" />
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6 text-balance">
            El muro de<br />
            <em className="italic text-white/60">bendiciones</em>
          </h2>
          <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-md mx-auto">
            Escribe de forma anónima lo que necesitas soltar.<br />
            Sin respuestas. Sin likes. Solo palabras que sanan.
          </p>
          <Link href="/bendiciones" className="btn-primary">
            Ir al muro →
          </Link>
        </div>

      </section>

    </SiteLayout>
  )
}
