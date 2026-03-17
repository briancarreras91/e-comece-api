require("dotenv").config(); // carga variables de entorno

const connectMongo = require("./src/config/mongo");
const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const path = require("path");

const productsRouter = require("./src/routes/products.router");
const cartsRouter = require("./src/routes/carts.router");

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
connectMongo();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta estática para imágenes y assets
app.use(
  "/imagenes",
  express.static(path.join(__dirname, process.env.IMAGES_PATH)),
);
app.use("/css", express.static(path.join(__dirname, process.env.CSS_PATH)));
app.use("/js", express.static(path.join(__dirname, process.env.JS_PATH)));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Routers principales
app.use("/", productsRouter);
app.use("/", cartsRouter);

// Servidor HTTP
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`),
);

// Socket.io
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Eventos de productos en tiempo real
  socket.on("nuevoProducto", async (prod) => {
    io.emit("productoAgregado", prod);
  });

  socket.on("eliminarProducto", async (id) => {
    io.emit("productoEliminado", id);
  });

  socket.on("actualizarProducto", async (updated) => {
    io.emit("productoActualizado", updated);
  });
});
