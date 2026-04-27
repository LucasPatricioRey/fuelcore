import { mockProducts } from '../data/mockProducts'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      throw new Error('No se pudieron cargar los productos.')
    }

    const data = await response.json()
    return data.products ?? []
  } catch (error) {
    console.warn('Se usaran productos temporales mientras la API no este disponible.', error)
    return mockProducts
  }
}
