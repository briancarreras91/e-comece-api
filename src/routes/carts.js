const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const cartManager = new CartManager();

// crea un nuevo carrito
router.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

// devuelve productos de un carrito
router.get("/:cid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// agrega producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const updatedCart = cartManager.addProductToCart(cid, pid);

  if (!updatedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(updatedCart);
});

module.exports = router;
