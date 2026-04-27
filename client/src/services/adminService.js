import { apiRequest } from './api'

export const getAdminSummary = async (token) =>
  apiRequest('/dashboard/summary', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const getAdminOrders = async (token) =>
  apiRequest('/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const updateAdminOrderStatus = async ({ token, orderId, status }) =>
  apiRequest(`/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      status,
    },
  })
