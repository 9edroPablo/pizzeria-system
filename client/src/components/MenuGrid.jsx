import PizzaCard from './PizzaCard.jsx'
import SkeletonCard from './SkeletonCard.jsx'

export default function MenuGrid({ pizzas = [], loading = false, onAdd }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pizzas.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} onAdd={onAdd} />
      ))}
    </div>
  )
}
