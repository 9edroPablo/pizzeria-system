import { Link } from 'react-router-dom'
import { IconArrowLeft } from './icons.jsx'

export default function PageHeader({
  eyebrow,
  title,
  description,
  backTo,
  backLabel = 'Volver',
  actions,
  children,
}) {
  return (
    <div className="border-b border-line bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        {backTo && (
          <Link
            to={backTo}
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted transition hover:text-ink"
          >
            <IconArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}
