import { mockProducts } from '../data/mockProducts'
import { API_BASE_URL } from './api'

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
