# FuelCore

Base inicial de un e-commerce de suplementos y fitness orientado a portfolio.

## Stack

- Vue 3
- Vue Router
- Pinia
- Node.js + Express
- MongoDB + Mongoose
- JWT
- Stripe

## Estructura

```txt
client/  frontend en Vue
server/  API REST en Express
```

## Etapas del proyecto

1. Definicion del producto y alcance
2. Arquitectura general
3. Base del frontend y backend
4. Autenticacion y roles
5. Catalogo, carrito y checkout
6. Pagos con Stripe
7. Panel admin y dashboard
8. Pulido final y deploy

## Deploy rapido

### Frontend en Vercel

- Root Directory: `client`
- Preset: `Vite`
- Variable requerida: `VITE_API_URL`

### Backend en Render

El repo incluye un [render.yaml](C:\Users\lucas\Documents\Codex\2026-04-27\me-gustaria-una-tienda-de-suplementos\render.yaml) para dejar configurado el servicio web del backend.

Valores importantes:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check: `/api/health`

Variables requeridas en Render:

- `CLIENT_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`
