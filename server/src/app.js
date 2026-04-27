import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { env } from './config/env.js'
import { handleMercadoPagoWebhook } from './controllers/paymentController.js'
import { dashboardRouter } from './routes/dashboardRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFoundHandler } from './middlewares/notFoundHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { orderRouter } from './routes/orderRoutes.js'
import { paymentRouter } from './routes/paymentRoutes.js'
import { productRouter } from './routes/productRoutes.js'
import { asyncHandler } from './utils/asyncHandler.js'

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
  app.post('/api/payments/webhook', express.json(), asyncHandler(handleMercadoPagoWebhook))
  app.use(express.json())
  app.use(morgan('dev'))

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'fuelcore-api',
      timestamp: new Date().toISOString(),
    })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/dashboard', dashboardRouter)
  app.use('/api/products', productRouter)
  app.use('/api/orders', orderRouter)
  app.use('/api/payments', paymentRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
