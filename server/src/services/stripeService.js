import Stripe from 'stripe'
import { env } from '../config/env.js'
import { AppError } from '../utils/appError.js'

let stripeClient

export const getStripeClient = () => {
  if (!env.stripeSecretKey) {
    throw new AppError('Falta configurar STRIPE_SECRET_KEY en el backend.', 500)
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey)
  }

  return stripeClient
}
