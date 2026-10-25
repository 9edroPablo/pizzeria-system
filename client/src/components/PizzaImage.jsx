// Ilustración de pizza generada con SVG para no depender de fotos
// externas mientras se exportan los assets del Figma.

const CRUST = '#e9bd6d'
const CRUST_DARK = '#d9a24a'
const SAUCE = '#cf4433'
const CHEESE = '#f6d789'

const TOPPINGS = {
  pepperoni: [
    <circle key="p1" cx="70" cy="72" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
    <circle key="p2" cx="108" cy="58" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
    <circle key="p3" cx="132" cy="96" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
    <circle key="p4" cx="82" cy="122" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
    <circle key="p5" cx="120" cy="132" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
    <circle key="p6" cx="98" cy="94" r="10" fill="#b3272d" stroke="#8f1c22" strokeWidth="2" />,
  ],
  margarita: [
    <ellipse key="m1" cx="72" cy="80" rx="11" ry="6" fill="#2e7d32" transform="rotate(-20 72 80)" />,
    <ellipse key="m2" cx="126" cy="70" rx="11" ry="6" fill="#2e7d32" transform="rotate(25 126 70)" />,
    <ellipse key="m3" cx="112" cy="130" rx="11" ry="6" fill="#2e7d32" transform="rotate(-15 112 130)" />,
    <circle key="m4" cx="92" cy="104" r="9" fill="#fff8ec" stroke="#f0e4c8" strokeWidth="2" />,
    <circle key="m5" cx="60" cy="120" r="8" fill="#fff8ec" stroke="#f0e4c8" strokeWidth="2" />,
    <circle key="m6" cx="140" cy="108" r="8" fill="#fff8ec" stroke="#f0e4c8" strokeWidth="2" />,
  ],
  hawaiana: [
    <rect key="h1" x="62" y="66" width="15" height="15" rx="3" fill="#f4c542" stroke="#d9a92f" strokeWidth="2" transform="rotate(12 70 74)" />,
    <rect key="h2" x="118" y="58" width="15" height="15" rx="3" fill="#f4c542" stroke="#d9a92f" strokeWidth="2" transform="rotate(-8 126 66)" />,
    <rect key="h3" x="126" y="120" width="15" height="15" rx="3" fill="#f4c542" stroke="#d9a92f" strokeWidth="2" transform="rotate(16 134 128)" />,
    <circle key="h4" cx="86" cy="112" r="9" fill="#f2a3a3" stroke="#e07b7b" strokeWidth="2" />,
    <circle key="h5" cx="112" cy="96" r="9" fill="#f2a3a3" stroke="#e07b7b" strokeWidth="2" />,
  ],
  quesos: [
    <circle key="q1" cx="74" cy="76" r="10" fill="#fff8ec" stroke="#e8d9b0" strokeWidth="2" />,
    <circle key="q2" cx="126" cy="68" r="10" fill="#f7e2a0" stroke="#e0c460" strokeWidth="2" />,
    <circle key="q3" cx="134" cy="118" r="9" fill="#c9d4e8" stroke="#9fb0d0" strokeWidth="2" />,
    <circle key="q4" cx="84" cy="128" r="9" fill="#f0dca0" stroke="#d9c078" strokeWidth="2" />,
    <circle key="q5" cx="102" cy="98" r="8" fill="#fff8ec" stroke="#e8d9b0" strokeWidth="2" />,
  ],
  vegetariana: [
    <circle key="v1" cx="70" cy="78" r="9" fill="none" stroke="#d2452e" strokeWidth="6" />,
    <circle key="v2" cx="128" cy="70" r="9" fill="none" stroke="#2e7d32" strokeWidth="6" />,
    <circle key="v3" cx="132" cy="122" r="9" fill="none" stroke="#e8a13a" strokeWidth="6" />,
    <circle key="v4" cx="78" cy="126" r="9" fill="none" stroke="#a56cc1" strokeWidth="6" />,
    <circle key="v5" cx="102" cy="100" r="7" fill="#efe6d8" stroke="#d9cbb4" strokeWidth="2" />,
  ],
  mexicana: [
    <circle key="x1" cx="72" cy="76" r="8" fill="none" stroke="#2e7d32" strokeWidth="5" />,
    <circle key="x2" cx="126" cy="66" r="8" fill="none" stroke="#2e7d32" strokeWidth="5" />,
    <circle key="x3" cx="130" cy="122" r="8" fill="none" stroke="#2e7d32" strokeWidth="5" />,
    <circle key="x4" cx="80" cy="124" r="7" fill="#7a1f1f" stroke="#5c1414" strokeWidth="2" />,
    <circle key="x5" cx="106" cy="96" r="6" fill="#7a1f1f" stroke="#5c1414" strokeWidth="2" />,
    <circle key="x6" cx="98" cy="60" r="4" fill="#f4c542" />,
    <circle key="x7" cx="112" cy="138" r="4" fill="#f4c542" />,
  ],
}

export default function PizzaImage({ topping = 'pepperoni', className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="100" cy="100" r="92" fill={CRUST} />
      <circle cx="100" cy="100" r="92" fill="none" stroke={CRUST_DARK} strokeWidth="5" />
      <circle cx="100" cy="16" r="4" fill={CRUST_DARK} opacity="0.6" />
      <circle cx="34" cy="72" r="3" fill={CRUST_DARK} opacity="0.5" />
      <circle cx="168" cy="130" r="4" fill={CRUST_DARK} opacity="0.6" />
      <circle cx="122" cy="184" r="3" fill={CRUST_DARK} opacity="0.5" />
      <circle cx="100" cy="100" r="74" fill={SAUCE} />
      <circle cx="100" cy="100" r="70" fill={CHEESE} opacity="0.96" />
      {TOPPINGS[topping] ?? null}
    </svg>
  )
}
