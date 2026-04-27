import { User } from '../models/User.js'
import { AppError } from '../utils/appError.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { signAccessToken } from '../utils/token.js'

const buildAuthPayload = (user) => ({
  token: signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  }),
  user,
})

export const register = async (request, response) => {
  const { firstName, lastName, email, password, phone } = request.body

  if (!firstName || !lastName || !email || !password) {
    throw new AppError('Nombre, apellido, email y password son obligatorios.', 400)
  }

  if (password.length < 8) {
    throw new AppError('La password debe tener al menos 8 caracteres.', 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    throw new AppError('Ya existe un usuario registrado con ese email.', 409)
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: await hashPassword(password),
    phone: phone?.trim() ?? '',
  })

  response.status(201).json(buildAuthPayload(user))
}

export const login = async (request, response) => {
  const { email, password } = request.body

  if (!email || !password) {
    throw new AppError('Email y password son obligatorios.', 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    throw new AppError('Credenciales invalidas.', 401)
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw new AppError('Credenciales invalidas.', 401)
  }

  response.status(200).json(buildAuthPayload(user))
}

export const me = async (request, response) => {
  response.status(200).json({
    user: request.user,
  })
}
