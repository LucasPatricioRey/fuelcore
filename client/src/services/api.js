export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? 'Ocurrio un error inesperado.')
  }

  return data
}
