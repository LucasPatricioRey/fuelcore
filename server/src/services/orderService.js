import { Product } from '../models/Product.js'
import { AppError } from '../utils/appError.js'

export const buildOrderFromItems = async (items) => {
  if (!Array.isArray(items) || !items.length) {
    throw new AppError('El carrito no puede estar vacio.', 400)
  }

  const normalizedItems = items.map((item) => ({
    productId: item.productId ?? item._id,
    quantity: Number(item.quantity ?? 1),
  }))

  const productIds = normalizedItems.map((item) => item.productId)
  const products = await Product.find({ _id: { $in: productIds }, active: true })
  const productsMap = new Map(products.map((product) => [product._id.toString(), product]))

  const orderItems = normalizedItems.map((item) => {
    const product = productsMap.get(String(item.productId))

    if (!product) {
      throw new AppError('Uno de los productos del carrito ya no esta disponible.', 400)
    }

    if (!item.quantity || item.quantity < 1) {
      throw new AppError('La cantidad de un producto es invalida.', 400)
    }

    if (product.stock < item.quantity) {
      throw new AppError(`No hay stock suficiente para ${product.name}.`, 400)
    }

    return {
      product: product._id,
      nameSnapshot: product.name,
      priceSnapshot: product.price,
      quantity: item.quantity,
      sourceProduct: product,
    }
  })

  const subtotal = orderItems.reduce(
    (total, item) => total + item.priceSnapshot * item.quantity,
    0,
  )

  return {
    items: orderItems,
    subtotal,
    total: subtotal,
  }
}
