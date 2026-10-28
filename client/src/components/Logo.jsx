import { Link } from 'react-router-dom'
import { IconFlame } from './icons.jsx'

export default function Logo({
  compact = false,
  subtitle = 'Pizzería Napolitana',
  to = '/menu',
  className = '',
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/20 transition group-hover:bg-brand-dark">
        <IconFlame className="h-5 w-5" />
      </span>
      <span className={compact ? 'hidden sm:block' : 'block'}>
        <span className="block text-sm font-extrabold uppercase leading-none tracking-[0.2em] text-ink">
          Forno <span className="text-brand">&</span> Farina
        </span>
        {subtitle && (
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            {subtitle}
          </span>
        )}
      </span>
    </>
  )

  if (!to) {
    return <div className={`flex items-center gap-3 ${className}`}>{content}</div>
  }

  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Forno & Farina, ir al menú"
    >
      {content}
    </Link>
  )
}
