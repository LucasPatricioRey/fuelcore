import { Router } from 'express'
import { getAdminSummary } from '../controllers/dashboardController.js'
import { authorize, protect } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const dashboardRouter = Router()

dashboardRouter.get('/summary', asyncHandler(protect), authorize('admin'), asyncHandler(getAdminSummary))

export { dashboardRouter }
