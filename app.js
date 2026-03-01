const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const path = require("path");
const ProductManager = require("./src/managers/ProductManager");
const productsRouter = require("./src/routes/products.router");

const app = express();
const PORT = 8080;
const manager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta estática para imágenes y assets
app.use(
  "/imagenes",
  express.static(path.join(__dirname, "src/assets/imagenes")),
);
app.use("/css", express.static(path.join(__dirname, "src/public/css")));
app.use("/js", express.static(path.join(__dirname, "src/public/js")));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Router principal
app.use("/", productsRouter);

// Servidor HTTP
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`),
);

// Socket.io
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Enviar lista inicial
  socket.emit("actualizarProductos", manager.getProducts());

  // Nuevo producto (ya creado vía REST, solo notificamos)
  socket.on("nuevoProducto", async (prod) => {
    io.emit("actualizarProductos", manager.getProducts());
  });

  // Eliminar producto
  socket.on("eliminarProducto", async (id) => {
    manager.deleteProduct(parseInt(id));
    io.emit("actualizarProductos", manager.getProducts());
  });

  // Actualizar producto (opcional)
  socket.on("actualizarProducto", async ({ id, fields }) => {
    manager.updateProduct(parseInt(id), fields);
    io.emit("actualizarProductos", manager.getProducts());
  });
});
