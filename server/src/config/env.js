import dotenv from 'dotenv'

dotenv.config()

export const env = {
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/fuelcore',
  port: Number(process.env.PORT ?? 4000),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
}
