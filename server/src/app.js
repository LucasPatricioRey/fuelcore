import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { notFoundHandler } from './middlewares/notFoundHandler.js'

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
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

  app.use(notFoundHandler)

  return app
}
