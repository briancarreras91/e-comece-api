const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
    console.log("Ruta absoluta del archivo carts.json:", this.filePath);

    // Si el archivo no existe, lo crea vacio
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  // Lee todos los carritos
  getCarts() {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  // Buscar carrito por id
  getCartById(id) {
    const carts = this.getCarts();
    return carts.find((c) => c.id === id);
  }

  // Crear carrito nuevo con id autoincrementable
  createCart() {
    const carts = this.getCarts();

    let newId;
    if (carts.length === 0) {
      newId = 1;
    } else {
      newId = carts[carts.length - 1].id + 1;
    }

    const newCart = { id: newId, products: [] };
    carts.push(newCart);

    fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Agregar producto a un carrito
  addProductToCart(cid, pid) {
    const carts = this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    carts[cartIndex] = cart;
    fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
