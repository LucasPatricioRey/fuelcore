<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <strong>FuelCore</strong>
        <p>
          Tienda de suplementos, rendimiento y nutricion deportiva con experiencia de compra real.
        </p>
      </div>

      <div class="site-footer__column">
        <h3>Categorias</h3>
        <router-link to="/tienda">Proteinas</router-link>
        <router-link to="/tienda">Creatina</router-link>
        <router-link to="/tienda">Pre entreno</router-link>
        <router-link to="/tienda">Control de peso</router-link>
      </div>

      <div class="site-footer__column">
        <h3>Compras</h3>
        <router-link to="/tienda">Tienda</router-link>
        <router-link to="/carrito">Carrito</router-link>
        <router-link to="/checkout">Checkout</router-link>
        <router-link to="/mi-cuenta">Mi cuenta</router-link>
      </div>

      <div class="site-footer__column">
        <h3>Atencion</h3>
        <span>Envios a todo el pais</span>
        <span>Mercado Pago protegido</span>
        <span>Soporte comercial</span>
        <span>Lun a Sab de 9 a 18 hs</span>
      </div>
    </div>
  </footer>
</template>
