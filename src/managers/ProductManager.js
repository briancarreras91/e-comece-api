const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  // Leer todos los productos
  getProducts() {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  // Buscar producto por id
  getProductById(id) {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  // Agregar producto con id
  addProduct(productData) {
    const products = this.getProducts();

    let newId;
    if (products.length === 0) {
      newId = 1;
    } else {
      newId = products[products.length - 1].id + 1;
    }

    // Crear producto usando la clase
    const newProduct = new Product(
      productData.title,
      productData.description,
      productData.code,
      productData.price,
      productData.status,
      productData.stock,
      productData.category,
      productData.thumbnails,
    );

    // Asignar id autoincrementable
    newProduct.id = newId;

    products.push(newProduct);
    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));

    return newProduct;
  }

  // Actualizar producto
  updateProduct(id, updateData) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    // Mantener id
    products[index] = {
      ...products[index],
      ...updateData,
      id: products[index].id,
    };

    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  // Eliminar producto
  deleteProduct(id) {
    const products = this.getProducts();
    const newProducts = products.filter((p) => p.id !== id);

    if (products.length === newProducts.length) return false;

    fs.writeFileSync(this.filePath, JSON.stringify(newProducts, null, 2));
    return true;
  }
}

module.exports = ProductManager;
