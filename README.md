# API E-commerce

Proyecto de e-commerce con **Node.js, Express, Handlebars, Multer y Socket.io**.  
Permite gestionar productos con imágenes, renderizar vistas en tiempo real y exponer endpoints REST.

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repo>
   cd api-ecommerce
   ```



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

Configuración

- Servidor: corre en http://localhost:8080.
- Carpetas estáticas:
- /imagenes → src/assets/imagenes
- /css → src/public/css
- /js → src/js
- Motor de vistas: Handlebars (src/views).

Endpoints REST
Obtener todos los productos
GET /api/products

Crear producto
POST /api/products

- Body (form-data):
- title (string)
- description (string)
- code (string)
- price (number)
- status (boolean)
- stock (number)
- category (string)
- thumbnail (file)
  Actualizar producto
  PUT /api/products/:id

Eliminar producto
DELETE /api/products/:id

Vistas

- Home:
  GET /
- Muestra catálogo normal.
- Realtime:
  GET /realtimeproducts
- Muestra catálogo en tiempo real con formulario para agregar productos.
  Usa Socket.io para actualizar la lista automáticamente.

Flujo de trabajo

- Crear producto vía Postman o formulario realtime.
- El servidor guarda la imagen en src/assets/imagenes y el producto en products.json.
- Socket.io emite evento y actualiza la vista realtime.
- El producto aparece en la lista con su imagen.

Estructura de carpetas
api-ecommerce/
│
├── app.js
├── src/
│ ├── assets/
│ │ └── imagenes/ # imágenes de productos
│ ├── managers/
│ │ └── ProductManager.js
│ ├── public/
│ │ ├── css/
│ │ └── js/
│ ├── routes/
│ │ └── products.router.js
│ └── views/
│ ├── home.handlebars
│ └── realTimeProducts.handlebars

Autor
Proyecto desarrollado por Brian Carreras.
