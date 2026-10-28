// Íconos extra que usan Mostrador y Cocina (mismo estilo que components/icons.jsx).
function Base({ className = 'h-4 w-4', children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconCash({ className }) {
  return (
    <Base className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v.01M18 14.5v.01" />
    </Base>
  )
}

export function IconChefHat({ className }) {
  return (
    <Base className={className}>
      <path d="M7 14a4 4 0 1 1 1.5-7.7A4 4 0 0 1 16 6a4 4 0 1 1 1 8" />
      <path d="M7 14v5h10v-5" />
      <path d="M7 16.5h10" />
    </Base>
  )
}

export function IconSort({ className }) {
  return (
    <Base className={className}>
      <path d="M4 6h16M4 12h11M4 18h6" />
    </Base>
  )
}
