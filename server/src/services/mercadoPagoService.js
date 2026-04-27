import { env } from '../config/env.js'
import { AppError } from '../utils/appError.js'

const MERCADO_PAGO_API_URL = 'https://api.mercadopago.com'

export const createMercadoPagoPreference = async (payload) => {
  if (!env.mercadoPagoAccessToken) {
    throw new AppError('Falta configurar MP_ACCESS_TOKEN en el backend.', 500)
  }

  const response = await fetch(`${MERCADO_PAGO_API_URL}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.mercadoPagoAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new AppError(
      data.message ?? 'No se pudo crear la preferencia de pago en Mercado Pago.',
      500,
    )
  }

  return data
}

export const getMercadoPagoPayment = async (paymentId) => {
  if (!env.mercadoPagoAccessToken) {
    throw new AppError('Falta configurar MP_ACCESS_TOKEN en el backend.', 500)
  }

  const response = await fetch(`${MERCADO_PAGO_API_URL}/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${env.mercadoPagoAccessToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new AppError(
      data.message ?? 'No se pudo consultar el pago en Mercado Pago.',
      500,
    )
  }

  return data
}
