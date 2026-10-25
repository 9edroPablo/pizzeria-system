import { IconMinus, IconPlus } from './icons.jsx'

export default function QuantityStepper({ value, min = 1, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-paper">
      <button
        type="button"
        aria-label="Quitar uno"
        className="flex h-8 w-8 items-center justify-center rounded-l-lg text-ink-soft transition hover:bg-wash disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <IconMinus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-bold text-ink">{value}</span>
      <button
        type="button"
        aria-label="Agregar uno"
        className="flex h-8 w-8 items-center justify-center rounded-r-lg text-ink-soft transition hover:bg-wash"
        onClick={() => onChange(value + 1)}
      >
        <IconPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
