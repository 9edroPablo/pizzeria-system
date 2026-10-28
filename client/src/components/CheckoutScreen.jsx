import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { DEMO_USER } from '../data/demoUser.js'
import { STORE } from '../data/store.js'
import { registerCustomer } from '../services/authService.js'
import { getCustomer } from '../services/customerService.js'
import { IS_MOCK } from '../services/dataSource.js'
import { getErrorMessage } from '../services/http.js'
import { createOrder } from '../services/orderService.js'
import { formatPrice } from '../services/format.js'
import Logo from './Logo.jsx'
import PizzaImage from './PizzaImage.jsx'
import {
  IconAlert,
  IconArrowLeft,
  IconBag,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconLock,
  IconMapPin,
  IconShieldCheck,
  IconWallet,
} from './icons.jsx'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15'

function formatCardNumber(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[11px] text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-brand">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CheckoutScreen() {
  const { items, subtotal, clearCart, openCart } = useCart()
  const { abierta, tiempoEspera, loading: storeLoading } = useStore()
  const { notify } = useToast()
  const navigate = useNavigate()
  const savedCustomer = useMemo(() => getCustomer(), [])

  const [form, setForm] = useState(() => ({
    nombre: IS_MOCK ? DEMO_USER.nombre : savedCustomer?.nombre ?? '',
    correo: IS_MOCK ? DEMO_USER.correo : savedCustomer?.correo ?? '',
    telefono: IS_MOCK ? DEMO_USER.telefono : savedCustomer?.telefono ?? '',
    notas: '',
    metodoPago: 'ANTICIPADO',
    cardNumber: '4242 4242 4242 4242',
    cardName: IS_MOCK ? DEMO_USER.nombre : savedCustomer?.nombre ?? '',
    expiry: '12/30',
    cvc: '123',
    acepta: false,
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const total = useMemo(() => subtotal, [subtotal])

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const update = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setField(field, value)
  }

  const validate = () => {
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'Escribe el nombre de quien recoge.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      next.correo = 'Escribe un correo válido.'
    }
    if (IS_MOCK && form.telefono.replace(/\D/g, '').length < 10) {
      next.telefono = 'Escribe un teléfono de al menos 10 dígitos.'
    }
    if (form.metodoPago === 'ANTICIPADO') {
      if (form.cardNumber.replace(/\D/g, '').length !== 16) {
        next.cardNumber = 'La tarjeta simulada debe tener 16 dígitos.'
      }
      if (!form.cardName.trim()) next.cardName = 'Escribe el nombre de la tarjeta.'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
        next.expiry = 'Usa el formato MM/AA.'
      } else {
        const month = Number(form.expiry.slice(0, 2))
        if (month < 1 || month > 12) next.expiry = 'El mes no es válido.'
      }
      if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = 'El CVC debe tener 3 o 4 dígitos.'
    }
    if (!form.acepta) {
      next.acepta = 'Confirma que aceptas las condiciones del pedido.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)

    if (items.length === 0) {
      setSubmitError('Tu carrito está vacío. Agrega una pizza antes de continuar.')
      return
    }
    if (storeLoading) {
      setSubmitError('Estamos consultando el estado de la tienda. Intenta de nuevo en un momento.')
      return
    }
    if (!abierta) {
      setSubmitError('La tienda está cerrada. No podemos registrar el pedido ahora.')
      return
    }
    if (!validate()) {
      const firstError = document.querySelector('[aria-invalid="true"]')
      firstError?.focus()
      return
    }

    setSubmitting(true)
    try {
      // En API primero identificamos/registramos el correo; después creamos el
      // pedido. En modo mock no hay backend que registrar.
      const customer = IS_MOCK
        ? null
        : await registerCustomer({
            nombre: form.nombre.trim(),
            correo: form.correo.trim(),
          })

      const order = await createOrder({
        usuarioId: IS_MOCK ? DEMO_USER.id : customer?._id,
        clienteNombre: form.nombre.trim(),
        clienteCorreo: form.correo.trim(),
        clienteTelefono: IS_MOCK ? form.telefono.trim() : '',
        metodoPago: form.metodoPago,
        notas: IS_MOCK ? form.notas.trim() : '',
        tiempoEstimado: tiempoEspera,
        items,
      })
      clearCart()
      notify('Pedido registrado. ¡Gracias por elegir Forno & Farina!')
      navigate(`/pedido/${order.id}?nuevo=1`, { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="border-b border-line">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted transition hover:text-ink"
            >
              <IconArrowLeft className="h-4 w-4" />
              Volver al menú
            </Link>
            <Logo compact />
          </div>
        </header>
        <main className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wash text-muted">
            <IconBag className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Tu carrito está vacío</h1>
            <p className="mt-2 text-sm text-muted">
              Elige tus pizzas favoritas y vuelve para finalizar el pedido.
            </p>
          </div>
          <Link
            to="/menu"
            className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Ir al menú
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wash/40 pb-28 lg:pb-12">
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              aria-label="Volver al menú"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper text-ink-soft transition hover:text-ink"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Link>
            <Logo compact subtitle={null} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            <IconLock className="h-3.5 w-3.5 text-open" />
            Checkout seguro
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              Último paso
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Finaliza tu pedido
            </h1>
            <p className="mt-2 text-sm text-muted">
              Recogerás en {STORE.direccion}, {STORE.colonia}.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold text-brand">
            <IconShieldCheck className="h-3.5 w-3.5" />
            Pago simulado
          </span>
        </div>

        {!abierta && !storeLoading && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft p-4 text-brand">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-bold">La tienda está cerrada</p>
              <p className="mt-1 text-xs leading-relaxed">
                Puedes conservar tu carrito, pero no registrar el pedido hasta el
                próximo horario.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-5">
            <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">
                  1
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-ink">Datos de contacto</h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Te avisaremos cuando el pedido esté listo.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className={IS_MOCK ? '' : 'sm:col-span-2'}>
                  <Field id="nombre" label="Nombre completo" error={errors.nombre}>
                    <input
                      id="nombre"
                      type="text"
                      autoComplete="name"
                      value={form.nombre}
                      onChange={update('nombre')}
                      aria-invalid={Boolean(errors.nombre)}
                      className={inputClass}
                      placeholder="Nombre de quien recoge"
                    />
                  </Field>
                </div>
                {IS_MOCK && (
                  <Field id="telefono" label="Teléfono" error={errors.telefono}>
                    <input
                      id="telefono"
                      type="tel"
                      autoComplete="tel"
                      value={form.telefono}
                      onChange={update('telefono')}
                      aria-invalid={Boolean(errors.telefono)}
                      className={inputClass}
                      placeholder="55 0000 0000"
                    />
                  </Field>
                )}
                <div className="sm:col-span-2">
                  <Field
                    id="correo"
                    label="Correo electrónico"
                    error={errors.correo}
                    hint="Registraremos tu pedido con este correo."
                  >
                    <input
                      id="correo"
                      type="email"
                      autoComplete="email"
                      value={form.correo}
                      onChange={update('correo')}
                      aria-invalid={Boolean(errors.correo)}
                      className={inputClass}
                      placeholder="tu@correo.mx"
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">
                  2
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-ink">Método de pago</h2>
                  <p className="mt-0.5 text-xs text-muted">
                    No se procesará ningún cargo real.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: 'ANTICIPADO',
                    title: 'Pagar ahora',
                    description: 'Tarjeta simulada',
                    Icon: IconCreditCard,
                  },
                  {
                    value: 'TIENDA',
                    title: 'Pagar al recoger',
                    description: 'Efectivo o tarjeta en el mostrador',
                    Icon: IconWallet,
                  },
                ].map(({ value, title, description, Icon }) => {
                  const selected = form.metodoPago === value
                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        selected
                          ? 'border-brand bg-brand-soft/50 ring-1 ring-brand/20'
                          : 'border-line bg-paper hover:border-ink/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="metodoPago"
                        value={value}
                        checked={selected}
                        onChange={update('metodoPago')}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          selected ? 'bg-brand text-white' : 'bg-wash text-ink-soft'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold text-ink">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                          {description}
                        </span>
                      </span>
                      <span
                        className={`ml-auto mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-brand bg-brand' : 'border-line'
                        }`}
                      >
                        {selected && <IconCheck className="h-2.5 w-2.5 text-white" />}
                      </span>
                    </label>
                  )
                })}
              </div>

              {form.metodoPago === 'ANTICIPADO' && (
                <div className="mt-4 rounded-xl border border-dashed border-line bg-wash/60 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-muted">
                    <IconLock className="h-3.5 w-3.5 text-open" />
                    Pago simulado: usa los datos precargados o cualquier tarjeta de
                    prueba. No ingreses datos reales.
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field id="cardNumber" label="Número de tarjeta" error={errors.cardNumber}>
                        <input
                          id="cardNumber"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={form.cardNumber}
                          onChange={(event) =>
                            setField('cardNumber', formatCardNumber(event.target.value))
                          }
                          aria-invalid={Boolean(errors.cardNumber)}
                          className={inputClass}
                          placeholder="0000 0000 0000 0000"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field id="cardName" label="Nombre en la tarjeta" error={errors.cardName}>
                        <input
                          id="cardName"
                          type="text"
                          autoComplete="off"
                          value={form.cardName}
                          onChange={update('cardName')}
                          aria-invalid={Boolean(errors.cardName)}
                          className={inputClass}
                          placeholder="Como aparece en la tarjeta"
                        />
                      </Field>
                    </div>
                    <Field id="expiry" label="Vencimiento" error={errors.expiry}>
                      <input
                        id="expiry"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={form.expiry}
                        onChange={(event) =>
                          setField('expiry', formatExpiry(event.target.value))
                        }
                        aria-invalid={Boolean(errors.expiry)}
                        className={inputClass}
                        placeholder="MM/AA"
                      />
                    </Field>
                    <Field id="cvc" label="CVC" error={errors.cvc}>
                      <input
                        id="cvc"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={form.cvc}
                        onChange={(event) =>
                          setField(
                            'cvc',
                            event.target.value.replace(/\D/g, '').slice(0, 4),
                          )
                        }
                        aria-invalid={Boolean(errors.cvc)}
                        className={inputClass}
                        placeholder="123"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </section>

            {IS_MOCK && (
              <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">
                    3
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-ink">Notas del pedido</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      Opcional. Alergias, indicaciones o algún detalle para la cocina.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="notas" className="sr-only">
                    Notas del pedido
                  </label>
                  <textarea
                    id="notas"
                    rows="3"
                    maxLength="240"
                    value={form.notas}
                    onChange={update('notas')}
                    className={`${inputClass} resize-none`}
                    placeholder="Ej. sin albahaca, cortar en 8 rebanadas…"
                  />
                  <p className="mt-1 text-right text-[10px] text-muted">
                    {form.notas.length}/240
                  </p>
                </div>
              </section>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-paper p-4">
              <input
                type="checkbox"
                checked={form.acepta}
                onChange={update('acepta')}
                aria-invalid={Boolean(errors.acepta)}
                className="mt-0.5 h-4 w-4 rounded border-line text-brand accent-brand"
              />
              <span>
                <span className="block text-xs font-semibold leading-relaxed text-ink-soft">
                  Confirmo que mi pedido es para recoger y acepto las condiciones del
                  servicio.
                </span>
                {errors.acepta && (
                  <span className="mt-1 block text-[11px] font-semibold text-brand">
                    {errors.acepta}
                  </span>
                )}
              </span>
            </label>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm font-semibold text-brand"
              >
                <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {submitError}
              </div>
            )}
          </form>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-sm font-extrabold text-ink">
                  Resumen · {items.reduce((sum, item) => sum + item.cantidad, 0)}{' '}
                  {items.reduce((sum, item) => sum + item.cantidad, 0) === 1
                    ? 'pizza'
                    : 'pizzas'}
                </h2>
                <button
                  type="button"
                  onClick={openCart}
                  className="text-[11px] font-bold uppercase tracking-wider text-brand transition hover:text-brand-dark"
                >
                  Editar
                </button>
              </div>

              <ul className="divide-y divide-line px-5">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3.5">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-wash">
                      <PizzaImage
                        topping={item.topping}
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink">{item.nombre}</p>
                      <p className="text-[10px] text-muted">
                        {item.cantidad} × {formatPrice(item.precio)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-ink">
                      {formatPrice(item.precio * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-line px-5 py-4 text-sm">
                <div className="flex items-center justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-ink-soft">
                  <span>Recoger en tienda</span>
                  <span className="font-semibold text-open">Gratis</span>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <span className="font-bold text-ink">Total</span>
                  <span className="text-2xl font-extrabold text-ink">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-right text-[10px] text-muted">IVA incluido · MXN</p>
              </div>

              <div className="border-t border-line bg-wash/50 px-5 py-4">
                <div className="flex items-start gap-2.5">
                  <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <p className="text-[11px] font-bold text-ink">Recoger en la pizzería</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                      {STORE.direccion}, {STORE.colonia}
                      <br />
                      {STORE.ciudad} {STORE.codigoPostal}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2.5">
                  <IconClock className="h-4 w-4 shrink-0 text-brand" />
                  <p className="text-[11px] text-muted">
                    Listo en {tiempoEspera ?? 'unos minutos'}
                  </p>
                </div>
              </div>

              <div className="border-t border-line p-5">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting || storeLoading || !abierta}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted"
                >
                  {submitting ? (
                    'Registrando pedido…'
                  ) : storeLoading ? (
                    'Consultando tienda…'
                  ) : !abierta ? (
                    'Tienda cerrada'
                  ) : (
                    <>
                      Confirmar pedido · {formatPrice(total)}
                    </>
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-muted">
                  <IconShieldCheck className="h-3.5 w-3.5 text-open" />
                  Pago simulado. No se guardan datos de tarjeta.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Total
            </p>
            <p className="text-lg font-extrabold text-ink">{formatPrice(total)}</p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={submitting || storeLoading || !abierta}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {submitting
              ? 'Registrando…'
              : storeLoading
                ? 'Consultando tienda…'
                : !abierta
                  ? 'Tienda cerrada'
                  : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
