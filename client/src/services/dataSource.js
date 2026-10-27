export const DATA_SOURCE = (
  import.meta.env.VITE_DATA_SOURCE ?? 'mock'
).toLowerCase()

export const IS_MOCK = DATA_SOURCE !== 'api'
