import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/productController.js'
import { authorize, protect } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const productRouter = Router()

productRouter.get('/', asyncHandler(getProducts))
productRouter.get('/:slug', asyncHandler(getProductBySlug))
productRouter.post('/', asyncHandler(protect), authorize('admin'), asyncHandler(createProduct))
productRouter.put('/:id', asyncHandler(protect), authorize('admin'), asyncHandler(updateProduct))
productRouter.delete('/:id', asyncHandler(protect), authorize('admin'), asyncHandler(deleteProduct))

export { productRouter }
