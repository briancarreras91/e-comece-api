const { Router } = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = Router();

// Checkout de un carrito: muestra resumen
router.post("/api/carts/:id/checkout", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("products.product")
      .lean();

    if (!cart || cart.products.length === 0) {
      return res.render("checkout", {
        layout: "main",
        products: [],
        total: 0,
        error: "El carrito está vacío",
      });
    }

    // Calcular total
    let total = 0;
    cart.products.forEach((item) => {
      total += item.product.price * item.quantity;
    });

    const orderId = `ORD-${Date.now()}`;

    res.render("checkout", {
      layout: "main",
      products: cart.products,
      total,
      orderId,
      cartId: cart._id,
    });
  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).render("checkout", {
      layout: "main",
      products: [],
      total: 0,
      error: error.message,
    });
  }
});

// Confirmar compra: vaciar carrito y descontar stock
router.post("/checkout/:cid/confirm", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.render("checkout", {
        layout: "main",
        products: [],
        total: 0,
        error: "El carrito está vacío",
      });
    }

    // Calcular total y descontar stock al confirmar
    let total = 0;
    for (const item of cart.products) {
      total += item.product.price * item.quantity;

      const product = await Product.findById(item.product._id);
      if (product) {
        if (item.quantity > product.stock) {
          return res.render("checkout", {
            layout: "main",
            products: cart.products,
            total,
            error: `Stock insuficiente para ${product.title}`,
          });
        }
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const orderId = `ORD-${Date.now()}`;

    // Vaciar carrito después de confirmar
    cart.products = [];
    await cart.save();

    res.render("checkout", {
      layout: "main",
      products: [],
      total,
      orderId,
      message: "¡Gracias por su compra!",
      logo: "/src/assets/imagenes/Logo.png", // logo institucional
    });
  } catch (error) {
    console.error("Error al confirmar compra:", error);
    res.status(500).render("checkout", {
      layout: "main",
      products: [],
      total: 0,
      error: error.message,
    });
  }
});

module.exports = router;
