import dotenv from 'dotenv'

dotenv.config()

export const env = {
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret',
  mongodbUri:
    process.env.MONGO_URI ??
    process.env.MONGODB_URI ??
    'mongodb://127.0.0.1:27017/fuelcore',
  port: Number(process.env.PORT ?? 4000),
  mercadoPagoAccessToken: process.env.MP_ACCESS_TOKEN ?? '',
  mercadoPagoWebhookSecret: process.env.MP_WEBHOOK_SECRET ?? '',
  mercadoPagoCurrency: process.env.MP_CURRENCY ?? 'ARS',
}
