import { Router } from 'express'
import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { authorize, protect } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const orderRouter = Router()

orderRouter.use(asyncHandler(protect))
orderRouter.get('/', authorize('admin'), asyncHandler(getAllOrders))
orderRouter.get('/my-orders', asyncHandler(getMyOrders))
orderRouter.get('/:id', asyncHandler(getOrderById))
orderRouter.put('/:id/status', authorize('admin'), asyncHandler(updateOrderStatus))

export { orderRouter }
