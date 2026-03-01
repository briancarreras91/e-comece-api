import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./src/routes/products.js";
import cartsRouter from "./src/routes/carts.js";
import viewsRouter from "./src/routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8888;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública
app.use(express.static(join(__dirname, "src/public")));

// Carpeta de imágenes expuesta
app.use("/imagenes", express.static(join(__dirname, "src/assets/imagenes")));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.on("nuevoProducto", (data) => {
    io.emit("actualizarProductos", data);
  });
});
