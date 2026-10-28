import { IconWine } from './icons.jsx'

export default function UpsellCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-wash p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-brand">
        <IconWine className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-ink">¿Acompañas con Bebida?</p>
        <p className="text-xs text-muted">Refrescos artesanales y vinos italianos</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg border border-line bg-paper px-4 py-2 text-xs font-bold text-ink transition hover:border-ink/30"
      >
        + Ver
      </button>
    </div>
  )
}
