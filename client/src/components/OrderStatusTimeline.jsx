import {
  ORDER_FLOW,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  getStatusIndex,
} from '../context/orderStatus.js'
import { IconCheck } from './icons.jsx'

export default function OrderStatusTimeline({ estado, showDescriptions = true }) {
  const current = getStatusIndex(estado)

  return (
    <ol className="space-y-0">
      {ORDER_FLOW.map((status, index) => {
        const done = index < current
        const active = index === current

        return (
          <li key={status} className="relative flex gap-3.5 pb-6 last:pb-0">
            {index < ORDER_FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[13px] top-7 h-[calc(100%-14px)] w-0.5 rounded-full ${
                  done ? 'bg-open' : 'bg-line'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-extrabold ${
                done
                  ? 'border-open bg-open text-white'
                  : active
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-paper text-muted'
              }`}
            >
              {done ? <IconCheck className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div className={active ? 'pt-0.5' : 'pt-0.5 opacity-60'}>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`text-sm font-extrabold ${
                    active ? 'text-ink' : 'text-ink-soft'
                  }`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </p>
                {active && (
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand">
                    Ahora
                  </span>
                )}
              </div>
              {showDescriptions && (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {ORDER_STATUS_DESCRIPTIONS[status]}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
