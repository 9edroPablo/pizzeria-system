export const DATA_SOURCE = (
  import.meta.env.VITE_DATA_SOURCE ?? 'api'
).toLowerCase()

export const IS_MOCK = DATA_SOURCE !== 'api'
