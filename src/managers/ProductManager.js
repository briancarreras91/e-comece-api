const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error leyendo products.json:", error);
      return [];
    }
  }

  getProductById(id) {
    return this.getProducts().find((p) => p.id === id);
  }

  addProduct(productData) {
    try {
      const products = this.getProducts();
      const newId =
        products.length === 0 ? 1 : products[products.length - 1].id + 1;
      const newProduct = { id: newId, ...productData };
      products.push(newProduct);
      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error("Error agregando producto:", error);
      return null;
    }
  }

  updateProduct(id, updatedFields) {
    try {
      const products = this.getProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;

      products[index] = { ...products[index], ...updatedFields };
      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      console.error("Error actualizando producto:", error);
      return null;
    }
  }

  deleteProduct(id) {
    try {
      const products = this.getProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      products.splice(index, 1);
      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
      return id;
    } catch (error) {
      console.error("Error eliminando producto:", error);
      return null;
    }
  }
}

module.exports = ProductManager;
