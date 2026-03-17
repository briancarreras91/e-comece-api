const { Router } = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = Router();

// Crear un carrito vacío
router.post("/api/carts", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un carrito por ID
router.get("/api/carts/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate(
      "products.product",
    );
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post("/api/carts/:id/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Product.findById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    const existing = cart.products.find(
      (p) => p.product.toString() === req.params.pid,
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/api/carts/:id/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find(
      (p) => p.product.toString() === req.params.pid,
    );
    if (!productInCart) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    productInCart.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto del carrito
router.delete("/api/carts/:id/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== req.params.pid,
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout: finalizar compra
router.post("/api/carts/:id/checkout", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate(
      "products.product",
    );
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    // Calcular total
    let total = 0;
    cart.products.forEach((item) => {
      total += item.product.price * item.quantity;
    });

    // Vaciar carrito después de la compra
    cart.products = [];
    await cart.save();

    res.json({
      message: "Compra realizada con éxito",
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
