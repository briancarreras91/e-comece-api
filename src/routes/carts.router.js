const { Router } = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = Router();

// Vista del carrito por ID
router.get("/carts/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).render("carts", {
        layout: "main",
        products: [],
        total: 0,
        count: 0,
        error: "Carrito no encontrado",
      });
    }

    // Calcular total y cantidad
    let total = 0;
    let count = 0;
    cart.products.forEach((item) => {
      total += item.product.price * item.quantity;
      count += item.quantity;
    });

    res.render("carts", {
      layout: "main",
      products: cart.products,
      total,
      count,
      cartId: cart._id,
    });
  } catch (error) {
    console.error("Error al renderizar carrito:", error);
    res.status(500).render("carts", {
      layout: "main",
      products: [],
      total: 0,
      count: 0,
      error: error.message,
    });
  }
});

// Agregar producto al carrito
router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", error: "Producto no encontrado" });
    }

    const existingItem = cart.products.find(
      (item) => item.product.toString() === pid,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al agregar producto" });
  }
});

// Eliminar producto del carrito
router.post("/api/carts/:cid/products/:pid/delete", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid,
    );

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al eliminar producto" });
  }
});

// Vaciar carrito completo
router.post("/api/carts/:cid/empty", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    }

    cart.products = []; // vaciar array
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ status: "error", error: "Error al vaciar carrito" });
  }
});

module.exports = router;
