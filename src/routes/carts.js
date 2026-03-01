const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");
const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const product = productManager.getProductById(Number(pid));

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const updatedCart = cartManager.addProductToCart(Number(cid), Number(pid));
  if (!updatedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(updatedCart);
});

module.exports = router;
