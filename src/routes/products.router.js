const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const ProductManager = require("../managers/ProductManager");
const manager = new ProductManager();

const router = Router();

// Configuración de Multer para guardar imágenes en src/assets/imagenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets/imagenes"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // mantiene el nombre original
  },
});

const upload = multer({ storage });

// Home: muestra productos en catálogo normal
router.get("/", (req, res) => {
  const products = manager.getProducts();
  res.render("home", { products });
});

// Vista realtime: muestra productos y formulario
router.get("/realtimeproducts", (req, res) => {
  const products = manager.getProducts();
  res.render("realTimeProducts", { products });
});

// API REST
router.get("/api/products", (req, res) => {
  const products = manager.getProducts();
  res.json(products);
});

// Crear producto con upload de imagen
router.post("/api/products", upload.single("thumbnail"), (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Debe subir una imagen" });
  }

  const newProduct = manager.addProduct({
    title,
    description,
    code,
    price: Number(price),
    status: status === "true" || status === true,
    stock: Number(stock),
    category,
    thumbnail: req.file.filename, // nombre del archivo guardado
  });

  res.status(201).json(newProduct);
});

// Actualizar producto
router.put("/api/products/:id", (req, res) => {
  const updated = manager.updateProduct(parseInt(req.params.id), req.body);
  if (!updated)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updated);
});

// Eliminar producto
router.delete("/api/products/:id", (req, res) => {
  const deleted = manager.deleteProduct(parseInt(req.params.id));
  if (!deleted)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ deleted });
});

module.exports = router;
