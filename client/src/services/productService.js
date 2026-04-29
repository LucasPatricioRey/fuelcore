import { apiRequest } from './api'

const buildProductsPath = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return `/products${query ? `?${query}` : ''}`
}

export const getProducts = async (params = {}) => {
  const data = await apiRequest(buildProductsPath(params))
  return data.products ?? []
}

export const getProductBySlug = async (slug) => {
  const data = await apiRequest(`/products/${slug}`)
  return data.product
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
