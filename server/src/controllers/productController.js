import { Product } from '../models/Product.js'
import { AppError } from '../utils/appError.js'

const parseBoolean = (value) => {
  if (value === undefined) {
    return undefined
  }

  if (value === 'true' || value === true) {
    return true
  }

  if (value === 'false' || value === false) {
    return false
  }

  return undefined
}

const maybeNumber = (value, fallback) => {
  if (value === undefined) {
    return fallback
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? fallback : parsedValue
}

const buildProductPayload = (body, { partial = false } = {}) => {
  const payload = {}

  if (!partial || body.name !== undefined) payload.name = body.name?.trim()
  if (!partial || body.slug !== undefined) payload.slug = body.slug?.trim()
  if (!partial || body.description !== undefined) payload.description = body.description?.trim()
  if (!partial || body.price !== undefined) payload.price = maybeNumber(body.price, undefined)
  if (!partial || body.comparePrice !== undefined) {
    payload.comparePrice = maybeNumber(body.comparePrice, 0)
  }
  if (!partial || body.stock !== undefined) payload.stock = maybeNumber(body.stock, undefined)
  if (!partial || body.category !== undefined) payload.category = body.category?.trim()
  if (!partial || body.brand !== undefined) payload.brand = body.brand?.trim() || 'FuelCore'
  if (!partial || body.goal !== undefined) payload.goal = body.goal?.trim() || ''
  if (!partial || body.image !== undefined) payload.image = body.image?.trim() || ''
  if (!partial || body.images !== undefined) payload.images = Array.isArray(body.images) ? body.images : []
  if (!partial || body.featured !== undefined) payload.featured = parseBoolean(body.featured) ?? false
  if (!partial || body.active !== undefined) payload.active = parseBoolean(body.active) ?? true
  if (!partial || body.flavor !== undefined) payload.flavor = body.flavor?.trim() || ''

  return payload
}

export const getProducts = async (request, response) => {
  const {
    category,
    goal,
    featured,
    search,
    minPrice,
    maxPrice,
    sort = 'latest',
    includeInactive,
  } = request.query

  const filters = {}

  if (parseBoolean(includeInactive) !== true) {
    filters.active = true
  }

  if (category) {
    filters.category = category
  }

  if (goal) {
    filters.goal = goal
  }

  const featuredFilter = parseBoolean(featured)

  if (featuredFilter !== undefined) {
    filters.featured = featuredFilter
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ]
  }

  if (minPrice || maxPrice) {
    filters.price = {}

    if (minPrice) {
      filters.price.$gte = Number(minPrice)
    }

    if (maxPrice) {
      filters.price.$lte = Number(maxPrice)
    }
  }

  const sortMap = {
    latest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
  }

  const products = await Product.find(filters).sort(sortMap[sort] ?? sortMap.latest)

  response.status(200).json({
    products,
    total: products.length,
  })
}

export const getProductBySlug = async (request, response) => {
  const { slug } = request.params
  const product = await Product.findOne({ slug, active: true })

  if (!product) {
    throw new AppError('Producto no encontrado.', 404)
  }

  response.status(200).json({ product })
}

export const createProduct = async (request, response) => {
  const payload = buildProductPayload(request.body)

  if (!payload.name || !payload.slug || !payload.description || Number.isNaN(payload.price)) {
    throw new AppError('Faltan datos obligatorios para crear el producto.', 400)
  }

  if (Number.isNaN(payload.stock)) {
    throw new AppError('El stock debe ser un numero valido.', 400)
  }

  const existingProduct = await Product.findOne({ slug: payload.slug })

  if (existingProduct) {
    throw new AppError('Ya existe un producto con ese slug.', 409)
  }

  const product = await Product.create(payload)

  response.status(201).json({ product })
}

export const updateProduct = async (request, response) => {
  const { id } = request.params
  const payload = buildProductPayload(request.body, { partial: true })

  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Producto no encontrado.', 404)
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      product[key] = value
    }
  })

  await product.save()

  response.status(200).json({ product })
}

export const deleteProduct = async (request, response) => {
  const { id } = request.params
  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Producto no encontrado.', 404)
  }

  product.active = false
  await product.save()

  response.status(200).json({
    message: 'Producto desactivado correctamente.',
  })
}
