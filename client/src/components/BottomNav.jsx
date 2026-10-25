import { IconHome, IconOven, IconReceipt, IconUser } from './icons.jsx'

const ITEMS = [
  { label: 'Menú', Icon: IconHome, active: true },
  { label: 'Forno', Icon: IconOven, active: false },
  { label: 'Pedidos', Icon: IconReceipt, active: false },
  { label: 'Perfil', Icon: IconUser, active: false },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper md:hidden">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ label, Icon, active }) => (
          <li key={label}>
            <button
              type="button"
              className={`flex w-full flex-col items-center gap-1 py-3 text-[10px] font-semibold ${
                active ? 'text-brand' : 'text-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
