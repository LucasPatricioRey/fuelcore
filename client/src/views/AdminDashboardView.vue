<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '../stores/admin'
import { useAuthStore } from '../stores/auth'
import { formatPrice } from '../utils/formatters'

const authStore = useAuthStore()
const adminStore = useAdminStore()

const { summary, orders, products, isLoadingSummary, isLoadingOrders, isLoadingProducts, isSavingProduct, error } =
  storeToRefs(adminStore)

const statusOptions = ['pendiente', 'pagado', 'en preparacion', 'enviado', 'entregado', 'cancelado']

const emptyForm = () => ({
  name: '',
  slug: '',
  description: '',
  price: '',
  comparePrice: '',
  stock: '',
  category: 'proteinas',
  goal: 'recuperacion',
  flavor: '',
  image: '',
  imagesText: '',
  featured: false,
  active: true,
})

const form = reactive(emptyForm())
const editingProductId = ref('')
const formMessage = ref('')

const categoryOptions = ['proteinas', 'creatina', 'pre-entrenos', 'packs']
const goalOptions = ['recuperacion', 'fuerza', 'energia', 'rendimiento']

const activeProducts = computed(() => products.value.filter((product) => product.active))
const inactiveProducts = computed(() => products.value.filter((product) => !product.active))

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const resetForm = () => {
  Object.assign(form, emptyForm())
  editingProductId.value = ''
  formMessage.value = ''
}

const fillForm = (product) => {
  editingProductId.value = product._id
  form.name = product.name
  form.slug = product.slug
  form.description = product.description
  form.price = product.price
  form.comparePrice = product.comparePrice || ''
  form.stock = product.stock
  form.category = product.category
  form.goal = product.goal || 'recuperacion'
  form.flavor = product.flavor || ''
  form.image = product.image || ''
  form.imagesText = Array.isArray(product.images) ? product.images.join('\n') : ''
  form.featured = Boolean(product.featured)
  form.active = Boolean(product.active)
  formMessage.value = ''
}

const buildPayload = () => ({
  name: form.name,
  slug: form.slug || slugify(form.name),
  description: form.description,
  price: Number(form.price),
  comparePrice: form.comparePrice ? Number(form.comparePrice) : 0,
  stock: Number(form.stock),
  category: form.category,
  goal: form.goal,
  flavor: form.flavor,
  image: form.image,
  images: form.imagesText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean),
  featured: form.featured,
  active: form.active,
})

onMounted(async () => {
  if (authStore.token) {
    await Promise.all([
      adminStore.fetchSummary(authStore.token),
      adminStore.fetchOrders(authStore.token),
      adminStore.fetchProducts(authStore.token),
    ])
  }
})

const handleStatusChange = async (orderId, event) => {
  await adminStore.changeOrderStatus({
    token: authStore.token,
    orderId,
    status: event.target.value,
  })
}

const handleSaveProduct = async () => {
  formMessage.value = ''

  try {
    await adminStore.saveProduct({
      token: authStore.token,
      productId: editingProductId.value,
      product: buildPayload(),
    })

    formMessage.value = editingProductId.value
      ? 'Producto actualizado correctamente.'
      : 'Producto creado correctamente.'
    resetForm()
  } catch {
    formMessage.value = 'No se pudo guardar el producto.'
  }
}

const handleDisableProduct = async (productId) => {
  try {
    await adminStore.disableProduct({
      token: authStore.token,
      productId,
    })
  } catch {
    formMessage.value = 'No se pudo desactivar el producto.'
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="account-hero">
      <p class="eyebrow">Admin</p>
      <h1>Vision general del negocio en un solo panel.</h1>
      <p class="hero-copy">
        Consulta ventas acumuladas, ordenes recientes, niveles de stock y gestiona productos desde
        una misma vista.
      </p>
    </section>

    <p v-if="error" class="state-message">{{ error }}</p>

    <section class="admin-metrics">
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : formatPrice(summary?.totalRevenue ?? 0) }}</h2>
        <p>Facturacion acumulada</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.totalOrders ?? 0 }}</h2>
        <p>Ordenes totales</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.activeProducts ?? 0 }}</h2>
        <p>Productos activos</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.totalClients ?? 0 }}</h2>
        <p>Clientes registrados</p>
      </article>
    </section>

    <section class="cart-layout">
      <div class="summary-card admin-panel">
        <p class="eyebrow">Top productos</p>
        <h2 class="summary-card__title">Mayor salida</h2>
        <p v-if="isLoadingSummary" class="state-message">Cargando metricas...</p>
        <div v-else-if="summary?.topProducts?.length" class="admin-list">
          <div v-for="product in summary.topProducts" :key="product.name" class="summary-row">
            <span>{{ product.name }}</span>
            <strong>{{ product.unitsSold }} vendidos</strong>
          </div>
        </div>
      </div>

      <div class="summary-card admin-panel">
        <p class="eyebrow">Stock bajo</p>
        <h2 class="summary-card__title">Reposicion sugerida</h2>
        <p v-if="isLoadingSummary" class="state-message">Cargando stock...</p>
        <div v-else-if="summary?.lowStockProducts?.length" class="admin-list">
          <div
            v-for="product in summary.lowStockProducts"
            :key="product._id"
            class="summary-row"
          >
            <span>{{ product.name }}</span>
            <strong>{{ product.stock }} u.</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="summary-card admin-products">
      <div class="admin-products__header">
        <div>
          <p class="eyebrow">Productos</p>
          <h2 class="summary-card__title">Gestion de catalogo</h2>
        </div>

        <button class="ghost-button" type="button" @click="resetForm">Nuevo producto</button>
      </div>

      <div class="admin-products__layout">
        <form class="auth-form admin-product-form" @submit.prevent="handleSaveProduct">
          <div class="form-grid">
            <label class="form-field">
              <span>Nombre</span>
              <input v-model="form.name" type="text" placeholder="Whey Protein Performance 2 lb" required />
            </label>

            <label class="form-field">
              <span>Slug</span>
              <input v-model="form.slug" type="text" placeholder="se autocompleta si lo dejas vacio" />
            </label>
          </div>

          <label class="form-field">
            <span>Descripcion</span>
            <input v-model="form.description" type="text" placeholder="Descripcion comercial corta del producto" required />
          </label>

          <div class="form-grid">
            <label class="form-field">
              <span>Precio</span>
              <input v-model="form.price" type="number" min="0" required />
            </label>

            <label class="form-field">
              <span>Precio anterior</span>
              <input v-model="form.comparePrice" type="number" min="0" />
            </label>
          </div>

          <div class="form-grid">
            <label class="form-field">
              <span>Stock</span>
              <input v-model="form.stock" type="number" min="0" required />
            </label>

            <label class="form-field">
              <span>Sabor</span>
              <input v-model="form.flavor" type="text" placeholder="Chocolate, sin sabor, mixto..." />
            </label>
          </div>

          <div class="form-grid">
            <label class="form-field">
              <span>Categoria</span>
              <select v-model="form.category">
                <option v-for="category in categoryOptions" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </label>

            <label class="form-field">
              <span>Objetivo</span>
              <select v-model="form.goal">
                <option v-for="goal in goalOptions" :key="goal" :value="goal">
                  {{ goal }}
                </option>
              </select>
            </label>
          </div>

          <label class="form-field">
            <span>Imagen principal</span>
            <input v-model="form.image" type="text" placeholder="https://..." />
          </label>

          <label class="form-field">
            <span>Imagenes adicionales</span>
            <textarea v-model="form.imagesText" class="admin-textarea" rows="4" placeholder="Una URL por linea"></textarea>
          </label>

          <div class="admin-product-form__toggles">
            <label class="admin-checkbox">
              <input v-model="form.featured" type="checkbox" />
              <span>Producto destacado</span>
            </label>

            <label class="admin-checkbox">
              <input v-model="form.active" type="checkbox" />
              <span>Producto activo</span>
            </label>
          </div>

          <p v-if="formMessage" class="state-message">{{ formMessage }}</p>

          <div class="admin-product-form__actions">
            <button class="primary-button" type="submit" :disabled="isSavingProduct">
              {{ isSavingProduct ? 'Guardando...' : editingProductId ? 'Guardar cambios' : 'Crear producto' }}
            </button>
            <button class="ghost-button" type="button" @click="resetForm">Limpiar</button>
          </div>
        </form>

        <div class="admin-products__list">
          <p v-if="isLoadingProducts" class="state-message">Cargando productos...</p>

          <template v-else>
            <article v-for="product in activeProducts" :key="product._id" class="order-card order-card--admin">
              <div class="summary-row">
                <strong>{{ product.name }}</strong>
                <span>{{ formatPrice(product.price) }}</span>
              </div>
              <div class="summary-row">
                <span>{{ product.category }} / {{ product.goal }}</span>
                <strong>{{ product.stock }} u.</strong>
              </div>
              <div class="summary-row">
                <span>{{ product.featured ? 'Destacado' : 'Catalogo regular' }}</span>
                <span>{{ product.active ? 'Activo' : 'Inactivo' }}</span>
              </div>

              <div class="admin-products__actions">
                <button class="ghost-button" type="button" @click="fillForm(product)">Editar</button>
                <button class="ghost-button" type="button" @click="handleDisableProduct(product._id)">Desactivar</button>
              </div>
            </article>

            <div v-if="inactiveProducts.length" class="admin-products__inactive">
              <p class="eyebrow">Inactivos</p>
              <div class="admin-list">
                <div v-for="product in inactiveProducts" :key="product._id" class="summary-row">
                  <span>{{ product.name }}</span>
                  <strong>Oculto</strong>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="summary-card admin-orders">
      <p class="eyebrow">Ordenes recientes</p>
      <h2 class="summary-card__title">Gestion operativa</h2>
      <p v-if="isLoadingOrders" class="state-message">Cargando ordenes...</p>

      <div v-else class="admin-orders__table">
        <article v-for="order in orders" :key="order._id" class="order-card order-card--admin">
          <div class="summary-row">
            <span>Orden</span>
            <strong>#{{ order._id.slice(-6) }}</strong>
          </div>
          <div class="summary-row">
            <span>Cliente</span>
            <strong>{{ order.user?.firstName }} {{ order.user?.lastName }}</strong>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <strong>{{ formatPrice(order.total) }}</strong>
          </div>
          <div class="summary-row">
            <span>Pago</span>
            <strong>{{ order.paymentStatus }}</strong>
          </div>

          <label class="form-field">
            <span>Estado</span>
            <select :value="order.status" @change="handleStatusChange(order._id, $event)">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>
        </article>
      </div>
    </section>
  </main>
</template>
