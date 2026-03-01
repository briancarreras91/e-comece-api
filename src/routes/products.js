const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

// POST /api/products
router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    status === undefined ||
    !stock ||
    !category ||
    !thumbnails
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (
    typeof price !== "number" ||
    typeof status !== "boolean" ||
    typeof stock !== "number" ||
    !Array.isArray(thumbnails)
  ) {
    return res.status(400).json({ error: "Tipos de datos inválidos" });
  }

  const newProduct = productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// DELETE /api/products/:pid
router.delete("/:pid", (req, res) => {
  const id = Number(req.params.pid);
  const deleted = productManager.deleteProduct(id);
  if (!deleted)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado correctamente" });
});

module.exports = router;
