const categoryThemes = {
  proteinas: {
    eyebrow: 'Recuperacion',
    accent: '#ff8a3d',
    shadow: '#ffb06b',
  },
  creatina: {
    eyebrow: 'Potencia',
    accent: '#4ecdc4',
    shadow: '#9ef3ea',
  },
  'pre-entrenos': {
    eyebrow: 'Impulso',
    accent: '#ffd166',
    shadow: '#ffe7a5',
  },
  packs: {
    eyebrow: 'Combo',
    accent: '#f26ca7',
    shadow: '#ffb7d6',
  },
}

const defaultTheme = {
  eyebrow: 'FuelCore',
  accent: '#ff8a3d',
  shadow: '#ffd79f',
}

const toTitleCase = (value = '') =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const createFallbackDataUri = (product) => {
  const theme = categoryThemes[product?.category] ?? defaultTheme
  const title = encodeURIComponent(product?.name ?? 'FuelCore')
  const subtitle = encodeURIComponent(toTitleCase(product?.category ?? theme.eyebrow))
  const accent = encodeURIComponent(theme.accent)
  const shadow = encodeURIComponent(theme.shadow)

  return `data:image/svg+xml;charset=UTF-8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 900'>
    <defs>
      <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='%230d1117' />
        <stop offset='60%' stop-color='%23161d28' />
        <stop offset='100%' stop-color='%232b170f' />
      </linearGradient>
      <radialGradient id='glow' cx='20%' cy='15%' r='70%'>
        <stop offset='0%' stop-color='${shadow}' stop-opacity='0.65' />
        <stop offset='100%' stop-color='${shadow}' stop-opacity='0' />
      </radialGradient>
    </defs>
    <rect width='900' height='900' fill='url(%23bg)' />
    <rect width='900' height='900' fill='url(%23glow)' />
    <circle cx='675' cy='220' r='165' fill='${accent}' fill-opacity='0.18' />
    <rect x='78' y='78' width='744' height='744' rx='48' fill='none' stroke='rgba(255,255,255,0.14)' />
    <text x='100' y='190' fill='${accent}' font-family='Arial, sans-serif' font-size='34' letter-spacing='8'>${subtitle}</text>
    <text x='100' y='370' fill='%23f4ede6' font-family='Arial, sans-serif' font-size='72' font-weight='700'>${title}</text>
    <text x='100' y='470' fill='%23c7ced9' font-family='Arial, sans-serif' font-size='28'>Linea premium para fuerza, energia y recuperacion.</text>
    <rect x='100' y='605' width='212' height='88' rx='44' fill='${accent}' />
    <text x='146' y='660' fill='%230d1117' font-family='Arial, sans-serif' font-size='28' font-weight='700'>FUELCORE</text>
  </svg>`.replace(/\n\s+/g, '')
}

export const getProductTheme = (category) => categoryThemes[category] ?? defaultTheme

export const getProductImage = (product) => product?.image || createFallbackDataUri(product)

export const handleProductImageError = (event, product) => {
  if (!event?.target?.dataset?.fallbackApplied) {
    event.target.dataset.fallbackApplied = 'true'
    event.target.src = createFallbackDataUri(product)
  }
}
