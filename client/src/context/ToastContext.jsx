/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { IconAlert, IconCheck, IconInfo } from '../components/icons.jsx'

const ToastContext = createContext(null)

const TONES = {
  success: {
    icon: IconCheck,
    className: 'border-open/20 bg-open-soft text-open',
  },
  info: {
    icon: IconInfo,
    className: 'border-line bg-paper text-ink',
  },
  error: {
    icon: IconAlert,
    className: 'border-brand/20 bg-brand-soft text-brand',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message, { tone = 'success', duration = 2800 } = {}) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [...current.slice(-2), { id, message, tone }])
      window.setTimeout(() => remove(id), duration)
      return id
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-40 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-8 print:hidden"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.info
          const ToastIcon = tone.icon
          return (
            <div
              key={toast.id}
              className={`flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg shadow-ink/10 ${tone.className}`}
            >
              <ToastIcon className="h-4 w-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return context
}
