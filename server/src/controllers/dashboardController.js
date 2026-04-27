import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'

export const getAdminSummary = async (_request, response) => {
  const [orders, activeProducts, totalClients] = await Promise.all([
    Order.find().sort({ createdAt: -1 }),
    Product.countDocuments({ active: true }),
    User.countDocuments({ role: 'client' }),
  ])

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === 'paid')
    .reduce((total, order) => total + order.total, 0)

  const lowStockProducts = await Product.find({
    active: true,
    stock: {
      $lte: 10,
    },
  })
    .sort({ stock: 1 })
    .limit(5)

  const topProductsMap = new Map()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const currentEntry = topProductsMap.get(item.nameSnapshot) ?? {
        name: item.nameSnapshot,
        unitsSold: 0,
      }

      currentEntry.unitsSold += item.quantity
      topProductsMap.set(item.nameSnapshot, currentEntry)
    })
  })

  const topProducts = Array.from(topProductsMap.values())
    .sort((first, second) => second.unitsSold - first.unitsSold)
    .slice(0, 5)

  const ordersByStatus = orders.reduce((accumulator, order) => {
    accumulator[order.status] = (accumulator[order.status] ?? 0) + 1
    return accumulator
  }, {})

  response.status(200).json({
    summary: {
      totalRevenue,
      totalOrders: orders.length,
      activeProducts,
      totalClients,
      paidOrders: orders.filter((order) => order.paymentStatus === 'paid').length,
      averageTicket: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      lowStockProducts,
      topProducts,
      ordersByStatus,
    },
  })
}
