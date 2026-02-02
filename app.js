const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());

// Importar routers
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");

// Usar routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando en puerto 8080");
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
