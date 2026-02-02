class Product {
  constructor(title, description, code, price, status, stock, category, thumbnails) {
    this.title = title;              // String
    this.description = description;  // String
    this.code = code;                // String
    this.price = price;              // Number
    this.status = status;            // Boolean
    this.stock = stock;              // Number
    this.category = category;        // String
    this.thumbnails = thumbnails;    // Array de Strings
  }
}

module.exports = Product;
