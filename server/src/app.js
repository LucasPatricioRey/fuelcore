import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFoundHandler } from './middlewares/notFoundHandler.js'
import { authRouter } from './routes/authRoutes.js'

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
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
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
