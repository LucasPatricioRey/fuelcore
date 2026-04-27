import { Router } from 'express'
import { getMyOrders, getOrderById } from '../controllers/orderController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const orderRouter = Router()

orderRouter.use(asyncHandler(protect))
orderRouter.get('/my-orders', asyncHandler(getMyOrders))
orderRouter.get('/:id', asyncHandler(getOrderById))

export { orderRouter }
