export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const apiRequest = async (path, options = {}) => {
  const body =
    options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? 'Ocurrio un error inesperado.')
  }

  return data
}
