import { Order } from '../models/Order.js'

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
