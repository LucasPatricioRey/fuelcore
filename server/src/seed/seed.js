import { connectDatabase } from '../config/database.js'
import { env } from '../config/env.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { hashPassword } from '../utils/password.js'
import { seedProducts } from './products.js'

const seed = async () => {
  try {
    await connectDatabase(env.mongodbUri)

    await Product.deleteMany()
    await User.deleteMany({ role: { $in: ['admin'] } })

    await Product.insertMany(seedProducts)

    await User.create({
      firstName: 'Admin',
      lastName: 'FuelCore',
      email: 'admin@fuelcore.com',
      password: await hashPassword('Admin1234'),
      role: 'admin',
      phone: '',
    })

    console.log('Base inicial cargada correctamente.')
    process.exit(0)
  } catch (error) {
    console.error('No se pudo cargar la semilla.', error)
    process.exit(1)
  }
}

seed()
