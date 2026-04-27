import { Order } from '../models/Order.js'
import { AppError } from '../utils/appError.js'

export const getMyOrders = async (request, response) => {
  const orders = await Order.find({ user: request.user._id }).sort({ createdAt: -1 })

  response.status(200).json({
    orders,
  })
}

export const getOrderById = async (request, response) => {
  const order = await Order.findOne({
    _id: request.params.id,
    user: request.user._id,
  })

  if (!order) {
    response.status(404).json({ message: 'Orden no encontrada.' })
    return
  }

  response.status(200).json({ order })
}

export const getAllOrders = async (_request, response) => {
  const orders = await Order.find()
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })

  response.status(200).json({
    orders,
  })
}

export const updateOrderStatus = async (request, response) => {
  const allowedStatuses = ['pendiente', 'pagado', 'en preparacion', 'enviado', 'entregado', 'cancelado']
  const { id } = request.params
  const { status } = request.body

  if (!allowedStatuses.includes(status)) {
    throw new AppError('El estado de orden no es valido.', 400)
  }

  const order = await Order.findById(id)

  if (!order) {
    throw new AppError('Orden no encontrada.', 404)
  }

  order.status = status
  await order.save()

  response.status(200).json({
    order,
  })
}
