API E-commerce
Proyecto de e-commerce con Node.js, Express, Handlebars, Multer, MongoDB y Socket.io.
Permite gestionar productos con imágenes, renderizar vistas dinámicas y en tiempo real, manejar carritos con CRUD completo y realizar checkout con descuento de stock y generación de ticket.

Instalación

- Clonar el repositorio:
  git clone https://github.com/briancarreras91/e-comece-api
  cd e-comece-api
- Instalar dependencias:
  npm install
- Crear las carpetas necesarias:
  src/assets/imagenes
  src/public/css
  src/public/js
  src/views
- Colocar socket.js en:
  src/js/socket.js

- (el servidor lo expone en /js/socket.js).
  Configuración- Servidor: corre en http://localhost:8080.
- Carpetas estáticas:
- /imagenes → src/assets/imagenes
- /css → src/public/css
- /js → src/js
- Motor de vistas: Handlebars (src/views).
- Helpers registrados: eq, gt, lt, add, subtract, range (para filtros y paginación).
  Endpoints RESTProductos- Obtener productos con filtros, orden y paginación
  GET /products?category=...&availability=true&sort=asc&page=1&limit=10
- Crear producto
  POST /api/products
  Body (form-data):
- title (string)
- description (string)
- code (string)
- price (number)
- stock (number)
- category (string)
- thumbnail (file)
- Actualizar producto
  POST /api/products/:id/edit
- Eliminar producto
  POST /api/products/:id/delete
  Carrito- Agregar producto al carrito
  POST /api/carts/:cid/products/:pid
- Actualizar cantidad de producto
  PUT /api/carts/:cid/products/:pid
- Eliminar producto del carrito
  DELETE /api/carts/:cid/products/:pid
- Vaciar carrito
  DELETE /api/carts/:cid
  Checkout- Finalizar compra
  POST /api/carts/:cid/checkout
- Descuenta stock de productos.
- Genera ticket con total y fecha.
  Vistas- Catálogo normal
  GET /products
- Muestra productos con filtros dinámicos de categorías, orden por precio y paginación.
- Realtime
  GET /realtimeproducts
- Muestra catálogo en tiempo real con formulario para agregar productos.
- Usa Socket.io para actualizar la lista automáticamente.
- Checkout
  GET /checkout/:cid
- Muestra resumen del carrito y permite finalizar compra.
  Flujo de trabajo- Crear producto vía Postman o formulario realtime.
- El servidor guarda la imagen en src/assets/imagenes y el producto en MongoDB.
- Socket.io emite evento y actualiza la vista realtime.
- El producto aparece en la lista con su imagen.
- El usuario agrega productos al carrito, actualiza cantidades y realiza checkout.
- El stock se descuenta y se genera ticket.
  Estructura de carpetase-comece-api/
  │
  ├── app.js
  ├── src/
  │ ├── assets/
  │ │ └── imagenes/ # imágenes de productos
  │ ├── public/
  │ │ ├── css/
  │ │ └── js/
  │ ├── routes/
  │ │ ├── products.router.js
  │ │ ├── carts.router.js
  │ │ ├── checkout.router.js
  │ │ └── realtimeproducts.router.js
  │ ├── models/
  │ │ ├── Product.js
  │ │ └── Cart.js
  │ └── views/
  │ ├── products.handlebars
  │ ├── realtimeproducts.handlebars
  │ └── checkout.handlebars

AutorProyecto desarrollado por Brian Carreras.
