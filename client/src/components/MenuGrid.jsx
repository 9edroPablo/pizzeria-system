import PizzaCard from './PizzaCard.jsx'
import SkeletonCard from './SkeletonCard.jsx'
import { IconSearch } from './icons.jsx'

export default function MenuGrid({
  pizzas = [],
  loading = false,
  onAdd,
  abierta = true,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (pizzas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-paper px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wash text-muted">
          <IconSearch className="h-5 w-5" />
        </span>
        <p className="text-sm font-bold text-ink">No encontramos pizzas en esta línea</p>
        <p className="max-w-sm text-sm text-muted">
          Prueba con otra categoría o vuelve a cargar el menú.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pizzas.map((pizza) => (
        <PizzaCard
          key={pizza.id}
          pizza={pizza}
          onAdd={onAdd}
          abierta={abierta}
        />
      ))}
    </div>
  )
}
