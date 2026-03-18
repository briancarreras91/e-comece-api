const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const Cart = require("../models/Cart"); // <-- agregado

const router = Router();

// Configuración Multer con filtros y límite de tamaño
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets/imagenes"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG y PNG"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// Catálogo de productos
router.get("/products", async (req, res) => {
  try {
    // Si no hay carrito en sesión, crear uno
    if (!req.session.cartId) {
      const newCart = new Cart();
      await newCart.save();
      req.session.cartId = newCart._id.toString();
    }

    const productos = await Product.find().lean();
    res.render("products", {
      layout: "main",
      payload: productos,
      cartId: req.session.cartId, // <-- agregado
    });
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    res.status(500).render("products", {
      layout: "main",
      payload: [],
      error: "Error al cargar catálogo",
    });
  }
});

// Crear producto con imagen
router.post("/api/products", (req, res, next) => {
  upload.single("thumbnail")(req, res, async (err) => {
    if (err) {
      return res.status(400).render("realtimeproducts", {
        layout: "main",
        payload: [],
        error: err.message,
      });
    }
    try {
      const { title, description, price, stock, category, code } = req.body;
      const thumbnail = req.file ? `/imagenes/${req.file.filename}` : null;

      const newProduct = new Product({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      });

      await newProduct.save();
      res.redirect("/realtimeproducts");
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).send("Error al crear producto");
    }
  });
});

// Eliminar producto
router.post("/api/products/:id/delete", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (product.thumbnail && product.thumbnail.startsWith("/imagenes/")) {
      const filePath = path.join(
        __dirname,
        "../assets/imagenes",
        path.basename(product.thumbnail),
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar producto");
  }
});

// Editar producto
router.post("/api/products/:id/edit", (req, res, next) => {
  upload.single("thumbnail")(req, res, async (err) => {
    if (err) {
      return res.status(400).render("realtimeproducts", {
        layout: "main",
        payload: [],
        error: err.message,
      });
    }
    try {
      const { title, description, price, stock, category, code } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }

      if (req.file) {
        if (product.thumbnail && product.thumbnail.startsWith("/imagenes/")) {
          const oldPath = path.join(
            __dirname,
            "../assets/imagenes",
            path.basename(product.thumbnail),
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        product.thumbnail = `/imagenes/${req.file.filename}`;
      }

      product.title = title;
      product.description = description;
      product.code = code;
      product.price = price;
      product.stock = stock;
      product.category = category;

      await product.save();
      res.redirect("/realtimeproducts");
    } catch (error) {
      console.error("Error al editar producto:", error);
      res.status(500).send("Error al editar producto");
    }
  });
});

module.exports = router;
