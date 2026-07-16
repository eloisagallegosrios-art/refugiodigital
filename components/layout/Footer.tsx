import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-100 mt-24 bg-[#FAF7F0]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <p className="font-serif text-xl font-light text-stone-700 mb-3">Volver</p>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
            Un refugio digital para volver a la paz interior. Sin ruido. Sin algoritmos. Solo presencia.
          </p>
        </div>

        <div>
          <p className="text-eyebrow mb-4">Explorar</p>
          <nav className="flex flex-col gap-2">
            {[
              ['/reflexion',   'Reflexión del día'],
              ['/notas',       'Notas de consciencia'],
              ['/cuando',      'Cuando necesito…'],
              ['/biblioteca',  'Biblioteca'],
              ['/bendiciones', 'Bendiciones'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-between">
          <blockquote className="font-serif text-base text-stone-500 italic leading-relaxed">
            "La paz no está al final del camino.<br/>Es el camino."
          </blockquote>
          <p className="text-xs text-stone-300 mt-6">© {new Date().getFullYear()} Volver</p>
        </div>

      </div>
    </footer>
  )
}
