const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://fuelcore.onrender.com/api'
  : 'http://localhost:4000/api'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL

export const apiRequest = async (path, options = {}) => {
  const body =
    options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      body,
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Puede estar iniciandose en Render.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? 'Ocurrio un error inesperado.')
  }

  return data
}
