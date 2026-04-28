# FuelCore

FuelCore es un e-commerce full stack de suplementos y fitness construido como proyecto de portfolio con foco comercial real. La aplicación cubre catálogo, autenticación con roles, carrito, checkout integrado con Mercado Pago, historial de compras y un panel administrativo con métricas operativas.

## Demo

- Demo online: [fuelcore-drab.vercel.app](https://fuelcore-drab.vercel.app)
- API online: [fuelcore.onrender.com/api/health](https://fuelcore.onrender.com/api/health)
- Repositorio: [github.com/LucasPatricioRey/fuelcore](https://github.com/LucasPatricioRey/fuelcore)

## Qué resuelve

FuelCore está planteado como una marca de nutrición deportiva con una operación funcional de punta a punta:

- catálogo de productos con detalle individual
- carrito persistente
- checkout con Mercado Pago Checkout Pro
- registro e inicio de sesión con JWT
- historial de órdenes por usuario
- dashboard admin con métricas, stock bajo y gestión de estados

La intención del proyecto no fue armar una demo genérica, sino una tienda que se sienta creíble para un caso comercial real.

## Funcionalidades principales

### Cliente

- exploración de productos por categoría
- vista de detalle con cantidad seleccionable
- carrito persistido en localStorage
- checkout con creación de orden previa al pago
- redirección a Mercado Pago
- retorno al sitio con limpieza de carrito
- historial de compras desde la cuenta

### Administrador

- acceso protegido por rol
- vista de métricas generales
- lectura de órdenes recientes
- actualización de estado de órdenes
- detección de productos con stock bajo
- ranking simple de productos más vendidos

## Stack

### Frontend

- Vue 3
- Vue Router
- Pinia
- Vite

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Mercado Pago

## Arquitectura

```txt
fuelcore/
  client/   frontend en Vue 3
  server/   API REST en Express + MongoDB
```

## Flujo de compra

1. el usuario agrega productos al carrito
2. el frontend envía items y dirección al backend
3. el backend valida precios, stock y crea la orden pendiente
4. se genera una preferencia de pago en Mercado Pago
5. el usuario completa el pago en Checkout Pro
6. el webhook actualiza la orden a pagada y descuenta stock
7. la compra queda visible en la cuenta del cliente

## Variables de entorno

### Frontend

```env
VITE_API_URL=https://fuelcore.onrender.com/api
```

### Backend

```env
CLIENT_URL=https://fuelcore-drab.vercel.app
MONGO_URI=...
JWT_SECRET=...
MP_ACCESS_TOKEN=...
MP_WEBHOOK_SECRET=...
MP_CURRENCY=ARS
```

## Instalación local

### 1. Clonar el proyecto

```bash
git clone https://github.com/LucasPatricioRey/fuelcore.git
cd fuelcore
```

### 2. Instalar dependencias

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configurar variables de entorno

Crear:

- `client/.env`
- `server/.env`

Usando los valores detallados arriba.

### 4. Ejecutar el proyecto

Frontend:

```bash
cd client
npm run dev
```

Backend:

```bash
cd server
npm run dev
```

## Seed inicial

El backend incluye una semilla básica con productos de ejemplo y un usuario administrador.

```bash
cd server
npm run seed
```

Credenciales admin de semilla:

- email: `admin@fuelcore.com`
- password: `Admin1234`

## Deploy

### Frontend en Vercel

- Root Directory: `client`
- Framework Preset: `Vite`
- Variable requerida: `VITE_API_URL`

### Backend en Render

El proyecto incluye [`render.yaml`](./render.yaml) para facilitar la configuración del servicio.

Valores principales:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

## Estado actual

El proyecto se encuentra funcional en su flujo principal:

- catálogo online
- autenticación conectada a MongoDB
- checkout integrado con Mercado Pago
- webhook operativo
- cuenta de usuario con órdenes
- panel admin inicial con métricas y gestión

## Próximas mejoras posibles

- ABM completo de productos desde admin
- filtros avanzados y búsqueda
- cupones y promociones
- reseñas
- banners configurables
- auditoría de stock

## Autor

Desarrollado por [Lucas Patricio Rey](https://github.com/LucasPatricioRey).
