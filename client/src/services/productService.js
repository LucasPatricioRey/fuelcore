import { mockProducts } from '../data/mockProducts'
import { API_BASE_URL, apiRequest } from './api'

const buildProductsUrl = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return `${API_BASE_URL}/products${query ? `?${query}` : ''}`
}

const applyLocalFilters = (products, params = {}) => {
  let filtered = [...products]

  if (params.category && params.category !== 'todas') {
    filtered = filtered.filter((product) => product.category === params.category)
  }

  if (params.goal && params.goal !== 'todos') {
    filtered = filtered.filter((product) => product.goal === params.goal)
  }

  if (params.featured === 'true') {
    filtered = filtered.filter((product) => product.featured)
  }

  if (params.search) {
    const term = params.search.toLowerCase()
    filtered = filtered.filter((product) =>
      [product.name, product.description, product.category, product.goal]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }

  if (params.sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price)
  }

  if (params.sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price)
  }

  if (params.sort === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
}

export const getProducts = async (params = {}) => {
  try {
    const response = await fetch(buildProductsUrl(params))

    if (!response.ok) {
      throw new Error('No se pudieron cargar los productos.')
    }

    await response.json()
    return applyLocalFilters(mockProducts, params)
  } catch (error) {
    console.warn('Se usaran productos temporales mientras la API no este disponible.', error)
    return applyLocalFilters(mockProducts, params)
  }
}

export const getProductBySlug = async (slug) => {
  const fallbackProduct = mockProducts.find((product) => product.slug === slug)

  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`)

    if (!response.ok) {
      throw new Error('No se pudo cargar el producto.')
    }

    await response.json()
    if (fallbackProduct) {
      return fallbackProduct
    }
    throw new Error('No se pudo cargar el producto.')
  } catch (error) {
    if (!fallbackProduct) {
      throw error
    }

    return fallbackProduct
  }
}

export const createProduct = async ({ token, product }) =>
  apiRequest('/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })

export const updateProduct = async ({ token, productId, product }) =>
  apiRequest(`/products/${productId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })

export const deactivateProduct = async ({ token, productId }) =>
  apiRequest(`/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
