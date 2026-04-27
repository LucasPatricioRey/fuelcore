import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

const startServer = async () => {
  try {
    await connectDatabase(env.mongodbUri)

    const app = createApp()

    app.listen(env.port, () => {
      console.log(`Servidor API corriendo en http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('No se pudo iniciar el servidor', error)
    process.exit(1)
  }
}

startServer()
