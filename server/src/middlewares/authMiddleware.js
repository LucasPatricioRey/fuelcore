import { User } from '../models/User.js'
import { AppError } from '../utils/appError.js'
import { verifyAccessToken } from '../utils/token.js'

const extractBearerToken = (authorizationHeader = '') => {
  if (!authorizationHeader.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.replace('Bearer ', '').trim()
}

export const protect = async (request, _response, next) => {
  const token = extractBearerToken(request.headers.authorization)

  if (!token) {
    next(new AppError('No autorizado. Falta el token de acceso.', 401))
    return
  }

  try {
    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub)

    if (!user) {
      next(new AppError('No autorizado. El usuario ya no existe.', 401))
      return
    }

    request.user = user
    next()
  } catch {
    next(new AppError('Token invalido o vencido.', 401))
  }
}

export const authorize = (...allowedRoles) => (request, _response, next) => {
  if (!request.user || !allowedRoles.includes(request.user.role)) {
    next(new AppError('No tenes permisos para realizar esta accion.', 403))
    return
  }

  next()
}
