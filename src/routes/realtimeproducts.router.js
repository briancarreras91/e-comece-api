const { Router } = require("express");
const Product = require("../models/Product");

const router = Router();

// Vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const productos = await Product.find().lean();

    res.render("realtimeproducts", {
      layout: "main",
      payload: productos,
    });
  } catch (error) {
    console.error("Error al cargar productos en tiempo real:", error);
    res.status(500).render("realtimeproducts", {
      layout: "main",
      payload: [],
      error: "Error al cargar productos en tiempo real",
    });
  }
});

module.exports = router;
