const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

// Vista principal con lista de productos
router.get("/", (req, res) => {
  const products = productManager.getProducts();
  res.render("home", { products });
});

// Vista en tiempo real con WebSockets
router.get("/realtimeproducts", (req, res) => {
  const products = productManager.getProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;
