const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

// listar todos los productos
router.get("/", (req, res) => {
  const products = productManager.getProducts();
  res.json({ products });
});

// traer producto por id
router.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// agregar producto nuevo
router.post("/", (req, res) => {
  const newProduct = productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// actualizar producto
router.put("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const updatedProduct = productManager.updateProduct(pid, req.body);

  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updatedProduct);
});

// eliminar producto
router.delete("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const deleted = productManager.deleteProduct(pid);

  if (!deleted) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ message: "Producto eliminado correctamente" });
});

module.exports = router;
