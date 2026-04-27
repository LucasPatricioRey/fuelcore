import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { env } from '../config/env.js'
import { buildOrderFromItems } from '../services/orderService.js'
import { getStripeClient } from '../services/stripeService.js'
import { AppError } from '../utils/appError.js'

const buildSuccessUrl = () => `${env.clientUrl}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`
const buildCancelUrl = () => `${env.clientUrl}/checkout/cancelado`

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

  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: buildSuccessUrl(),
    cancel_url: buildCancelUrl(),
    client_reference_id: order._id.toString(),
    customer_email: request.user.email,
    metadata: {
      orderId: order._id.toString(),
      userId: request.user._id.toString(),
    },
    line_items: orderDraft.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: env.stripeCurrency,
        unit_amount: item.priceSnapshot,
        product_data: {
          name: item.nameSnapshot,
        },
      },
    })),
  })

  order.stripeCheckoutSessionId = session.id
  await order.save()

  response.status(200).json({
    checkoutUrl: session.url,
    orderId: order._id,
  })
}

export const handleStripeWebhook = async (request, response) => {
  const stripe = getStripeClient()
  const signature = request.headers['stripe-signature']

  if (!signature || !env.stripeWebhookSecret) {
    throw new AppError('Falta configurar la firma del webhook de Stripe.', 400)
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      env.stripeWebhookSecret,
    )
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (orderId) {
      const order = await Order.findById(orderId)

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid'
        order.status = 'pagado'
        order.stripeCheckoutSessionId = session.id ?? ''
        order.stripePaymentIntentId = session.payment_intent?.toString() ?? ''
        await order.save()

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              stock: -item.quantity,
            },
          })
        }
      }
    }
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (orderId) {
      const order = await Order.findById(orderId)

      if (order) {
        order.paymentStatus = 'failed'
        order.status = 'cancelado'
        await order.save()
      }
    }
  }

  response.json({ received: true })
}
