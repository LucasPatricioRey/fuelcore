import { apiRequest } from './api'

export const createCheckoutSession = async ({ token, items, shippingAddress }) =>
  apiRequest('/payments/create-checkout-session', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      items,
      shippingAddress,
    },
  })
