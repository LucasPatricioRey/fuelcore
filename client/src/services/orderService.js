import { apiRequest } from './api'

export const getMyOrders = async (token) =>
  apiRequest('/orders/my-orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
