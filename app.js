const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Routers
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.get("/", (req, res) => {
  const ProductManager = require("./src/managers/ProductManager");
  const productManager = new ProductManager();
  const products = productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

// Socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", (data) => {
    const ProductManager = require("./src/managers/ProductManager");
    const productManager = new ProductManager();
    const product = productManager.addProduct(data);
    io.emit("productAdded", product);
  });

  socket.on("deleteProduct", (id) => {
    const ProductManager = require("./src/managers/ProductManager");
    const productManager = new ProductManager();
    const deleted = productManager.deleteProduct(id);
    io.emit("productDeleted", deleted);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
