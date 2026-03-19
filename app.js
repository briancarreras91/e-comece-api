require("dotenv").config();

const connectMongo = require("./src/config/mongo");
const express = require("express");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session"); // <-- agregado

// Routers
const productsRouter = require("./src/routes/products.router");
const cartsRouter = require("./src/routes/carts.router");
const checkoutRouter = require("./src/routes/checkout.router");
const realtimeProductsRouter = require("./src/routes/realtimeproducts.router");

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
(async () => {
  try {
    await connectMongo();
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
})();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de sesión
app.use(
  session({
    secret: "clave-secreta", // cámbiala por algo seguro
    resave: false,
    saveUninitialized: true,
  }),
);

// Carpeta estática para imágenes y assets
app.use(
  "/imagenes",
  express.static(path.join(__dirname, process.env.IMAGES_PATH)),
);
app.use("/css", express.static(path.join(__dirname, process.env.CSS_PATH)));
app.use("/js", express.static(path.join(__dirname, process.env.JS_PATH)));

// Configuración de Handlebars con helpers
// Configuración de Handlebars con helpers
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      multiply: (a, b) => a * b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      range: (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) {
          arr.push(i);
        }
        return arr;
      },
    },
  }),
);

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Ruta raíz: redirige al catálogo
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Routers principales
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", checkoutRouter);
app.use("/", realtimeProductsRouter);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ status: "error", error: "Ruta no encontrada" });
});

// Servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
server.on("error", (error) => {
  console.error("Error en el servidor HTTP:", error.message);
});

// Socket.io
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.on("nuevoProducto", async (prod) => {
    try {
      io.emit("productoAgregado", prod);
    } catch (error) {
      console.error("Error al emitir productoAgregado:", error.message);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      io.emit("productoEliminado", id);
    } catch (error) {
      console.error("Error al emitir productoEliminado:", error.message);
    }
  });

  socket.on("actualizarProducto", async (updated) => {
    try {
      io.emit("productoActualizado", updated);
    } catch (error) {
      console.error("Error al emitir productoActualizado:", error.message);
    }
  });
});
