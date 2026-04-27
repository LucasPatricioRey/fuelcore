export const notFoundHandler = (request, response) => {
  response.status(404).json({
    message: `Ruta no encontrada: ${request.method} ${request.originalUrl}`,
  })
}
