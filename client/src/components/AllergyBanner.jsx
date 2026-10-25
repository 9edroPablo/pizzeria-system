import { IconLeaf } from './icons.jsx'

export default function AllergyBanner() {
  return (
    <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-wash p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-brand">
          <IconLeaf className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink">Alérgenos e ingredientes</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Todas nuestras pizzas contienen gluten y lácteos. Consulta la guía completa
            para conocer trazas de frutos secos y otros alérgenos.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/30"
      >
        Guía de Alérgenos
      </button>
    </section>
  )
}
