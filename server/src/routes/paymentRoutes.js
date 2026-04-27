import { Router } from 'express'
import { createCheckoutSession } from '../controllers/paymentController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const paymentRouter = Router()

paymentRouter.post('/create-checkout-session', asyncHandler(protect), asyncHandler(createCheckoutSession))

export { paymentRouter }
