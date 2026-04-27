import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { env } from '../config/env.js'
import { buildOrderFromItems } from '../services/orderService.js'
import {
  createMercadoPagoPreference,
  getMercadoPagoPayment,
} from '../services/mercadoPagoService.js'
import { AppError } from '../utils/appError.js'

const buildSuccessUrl = () => `${env.clientUrl}/checkout/exito`
const buildCancelUrl = () => `${env.clientUrl}/checkout/cancelado`
const buildPendingUrl = () => `${env.clientUrl}/checkout/pendiente`

export const createCheckoutSession = async (request, response) => {
  const { items, shippingAddress } = request.body

  if (
    !shippingAddress?.fullName ||
    !shippingAddress?.addressLine1 ||
    !shippingAddress?.city ||
    !shippingAddress?.postalCode ||
    !shippingAddress?.country
  ) {
    throw new AppError('Faltan datos del domicilio para iniciar el checkout.', 400)
  }

  const orderDraft = await buildOrderFromItems(items)

  const order = await Order.create({
    user: request.user._id,
    items: orderDraft.items.map(({ sourceProduct, ...item }) => item),
    subtotal: orderDraft.subtotal,
    total: orderDraft.total,
    status: 'pendiente',
    paymentStatus: 'pending',
    shippingAddress,
  })

  const preference = await createMercadoPagoPreference({
    items: orderDraft.items.map((item) => ({
      id: item.product.toString(),
      title: item.nameSnapshot,
      quantity: item.quantity,
      currency_id: env.mercadoPagoCurrency,
      unit_price: item.priceSnapshot,
    })),
    back_urls: {
      success: buildSuccessUrl(),
      failure: buildCancelUrl(),
      pending: buildPendingUrl(),
    },
    auto_return: 'approved',
    external_reference: order._id.toString(),
    payer: {
      email: request.user.email,
      name: request.user.firstName,
      surname: request.user.lastName,
    },
    notification_url: 'https://fuelcore.onrender.com/api/payments/webhook',
    metadata: {
      orderId: order._id.toString(),
      userId: request.user._id.toString(),
    },
    shipments: {
      receiver_address: {
        zip_code: shippingAddress.postalCode,
        street_name: shippingAddress.addressLine1,
        city_name: shippingAddress.city,
      },
    },
  })

  order.mercadoPagoPreferenceId = preference.id
  await order.save()

  response.status(200).json({
    checkoutUrl: preference.init_point,
    orderId: order._id,
  })
}

const markOrderAsPaid = async (order, paymentId) => {
  if (order.paymentStatus === 'paid') {
    return
  }

  order.paymentStatus = 'paid'
  order.status = 'pagado'
  order.mercadoPagoPaymentId = String(paymentId)
  await order.save()

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    })
  }
}

export const handleMercadoPagoWebhook = async (request, response) => {
  const paymentId = request.query['data.id'] ?? request.body?.data?.id
  const type = request.query.type ?? request.body?.type

  if (type !== 'payment' || !paymentId) {
    response.status(200).json({ received: true })
    return
  }

  const payment = await getMercadoPagoPayment(paymentId)
  const orderId = payment.external_reference

  if (!orderId) {
    response.status(200).json({ received: true })
    return
  }

  const order = await Order.findById(orderId)

  if (!order) {
    response.status(200).json({ received: true })
    return
  }

  if (payment.status === 'approved') {
    await markOrderAsPaid(order, payment.id)
  }

  if (payment.status === 'rejected' || payment.status === 'cancelled') {
    order.paymentStatus = 'failed'
    order.status = 'cancelado'
    order.mercadoPagoPaymentId = String(payment.id)
    await order.save()
  }

  if (payment.status === 'pending' || payment.status === 'in_process') {
    order.paymentStatus = 'pending'
    order.mercadoPagoPaymentId = String(payment.id)
    await order.save()
  }

  response.status(200).json({ received: true })
}
