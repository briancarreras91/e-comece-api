const { Router } = require("express");
const Product = require("../models/Product"); // Modelo de Mongoose
const uploadCloud = require("../middlewares/cloudinaryConfig"); // configuración de Cloudinary

const router = Router();

// Home: muestra productos en catálogo normal (desde MongoDB)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ error: "Error al cargar productos" });
  }
});

// Vista realtime: muestra productos y formulario
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ error: "Error al cargar productos" });
  }
});

// API REST: obtener productos con paginación, filtros y ordenamiento
router.get("/api/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, status } = req.query;

    // Filtros dinámicos
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status === "true";

    // Ordenamiento dinámico
    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    // Paginación con skip/limit
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear producto con upload de imagen en Cloudinary
router.post(
  "/api/products",
  uploadCloud.single("thumbnail"),
  async (req, res) => {
    try {
      const { title, description, code, price, status, stock, category } =
        req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Debe subir una imagen JPG o PNG" });
      }

      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }

      const newProduct = new Product({
        title,
        description,
        code,
        price: Number(price),
        status: status === "true" || status === true,
        stock: Number(stock),
        category,
        thumbnail: req.file.path, // URL pública de Cloudinary
      });

      await newProduct.save();

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Actualizar producto
router.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
